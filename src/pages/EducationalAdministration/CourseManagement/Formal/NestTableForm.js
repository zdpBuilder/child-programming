import React, { PureComponent, Fragment } from 'react';
import {
  Table,
  Button,
  message,
  Popconfirm,
  Divider,
  Select,
  TimePicker,
  DatePicker,
} from 'antd';
import moment from 'moment';
import isEqual from 'lodash/isEqual';
import styles from './style.less';

import globalData from '@/utils/globalData';

const { Option } = Select;
const { RangePicker } = DatePicker;

const dateFormat = 'YYYY-MM-DD';
const timeFormat = 'HH:mm:ss';
const parentColumnIdPrefix = 'PARENT_COLUMN_ID';
const childrenColumnIdPrefix = 'CHILDREN_COLUMN_ID';

// DOTO 选择班级之后，不能第二次再选！
class NestTableForm extends PureComponent {
  index = 0;

  childrenIndex = 0;

  preGradeId = -1;

  nextGradeId = -1;

  cacheOriginData = {};

  constructor(props) {
    super(props);
    this.expandedRowRender = this.expandedRowRender.bind(this);

    this.state = {
      data: props.value,
      parentTableLoading: false,
      /* eslint-disable-next-line react/no-unused-state */
      value: props.value,
    };
  }

  static getDerivedStateFromProps(nextProps, preState) {
    if (isEqual(nextProps.value, preState.value)) {
      return null;
    }
    return {
      data: nextProps.value,
      value: nextProps.value,
    };
  }

  // 通过key获取一行数据
  getRowByKey(key, newData) {
    const { data } = this.state;
    // 获取子行数据
    if (this.containBar(key)) {
      const rowData = newData || data;
      return this.getChildrenRowByKey(key, rowData);
    }
    return (newData || data).filter(item => item.key === key)[0];
  }

  // 获取子表格一行数据
  getChildrenRowByKey = (key, data) => {
    const keyArray = key.split('-');
    const parentData = data.filter(item => item.key === keyArray[0])[0];
    return parentData.childrenData.filter(item => item.key.split('-')[1] === keyArray[1])[0];
  }

  // 是否含有分隔符 -
  containBar = key => key ? (key.indexOf('-') !== -1) : false

  toggleEditable = (e, key) => {
    e.preventDefault();
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        this.cacheOriginData[key] = { ...target };
      }
      target.editable = !target.editable;
      this.setState({ data: newData });
    }
  };

  disabledDate = current =>
    // Can not select days before today and today
    current && current < moment().endOf('day')

  // 父表格添加一行
  newMember = () => {
    const { data = [] } = this.state;
    const editData = data.filter(item => item.editable === true);
    if (editData.length > 0) {
      message.warn('您还有未处理完的表格，无法新增！');
      return;
    }
    const newData = data.map(item => ({ ...item }));
    newData.push({
      childrenData: [],
      dateRange: {},
      editable: true,
      gradeId: {},
      isNew: true,
      key: `${parentColumnIdPrefix}_${this.index}`,
    });
    this.index += 1;
    this.setState({ data: newData });
  };

  // 子表格新增一行
  newChildrenMember = parentRecordKey => {
    const { data = [] } = this.state;
    const { childrenData = [] } = data.filter(item => item.key === parentRecordKey)[0];
    const newchildren = childrenData.map(item => ({ ...item }));
    newchildren.push({
      day: [],
      editable: true,
      isNew: true,
      key: `${parentRecordKey}-${childrenColumnIdPrefix}_${this.childrenIndex}`,
      timeRange: {},

    });
    this.childrenIndex += 1;
    const newData = data.map(item => ({ ...item }));
    newData.forEach(item => {
      if (item.key === parentRecordKey) {
        item.childrenData = newchildren;

      }
    });
    this.setState({ data: newData });
  };

  // 处理表格内容改变
  handleFieldChange(value, fieldName, key) {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      // 时间处理
      if (fieldName === 'startHour' || fieldName === 'endHour') {
        target.timeRange[fieldName] = value.format(timeFormat);
      }
      // 日期
      else if (fieldName === 'dateRange') {
        target[fieldName] =
          value.length === 2
            ? {
                startDate: value[0].format(dateFormat),
                endDate: value[1].format(dateFormat),
              }
            : {};
 }
      else { target[fieldName] = value; }
      this.setState({ data: newData });
      if (fieldName === 'gradeId') {
        this.nextGradeId = target.gradeId.key;
        const { handleGradeSelectDisabled } = this.props;
        handleGradeSelectDisabled(this.preGradeId, this.nextGradeId);
        this.preGradeId = this.nextGradeId;
      }
    }
  }

  // 保存
  saveRow(e, key) {
    e.persist();
    this.setState({
      parentTableLoading: true,
    });
    setTimeout(() => {
      if (this.clickedCancel) {
        this.clickedCancel = false;
        return;
      }
      const target = this.getRowByKey(key) || {};
      // 子表格校验
      if (this.containBar(key)) {
        if (!target.timeRange.startHour || !target.timeRange.endHour || target.day.length === 0) {
          message.error('请填写完整信息！');
          this.setState({
            parentTableLoading: false,
          });
          return;
        }
        if (target.timeRange.startHour >= target.timeRange.endHour) {
          message.error('请输入正确时间范围');
          this.setState({
            parentTableLoading: false,
          });
          return;
        }
      } else if (!target.gradeId.key || !target.dateRange.startDate) {
        // 父表格校验
          message.error('请填写完整信息！');
          e.target.focus();
          this.setState({
            parentTableLoading: false,
          });
          return;

      }
      delete target.isNew;
      this.toggleEditable(e, key);
      const { data } = this.state;
      const { onChange } = this.props;
      onChange(data);
      this.setState({
        parentTableLoading: false,
      });
    }, 500);
  }

  cancel(e, key) {
    this.clickedCancel = true;
    e.preventDefault();
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (!this.containBar(key)) {
      const { handleGradeSelectDisabled } = this.props;
      handleGradeSelectDisabled(target.gradeId.key);
    }
    if (this.cacheOriginData[key]) {
      Object.assign(target, this.cacheOriginData[key]);
      delete this.cacheOriginData[key];
    }
    target.editable = false;
    this.setState({ data: newData });
    this.clickedCancel = false;
  }

  handleKeyPress(e, key) {
    if (e.key === 'Enter') {
      this.saveRow(e, key);
    }
  }

  // 移除一行
  remove(key) {
    const { data } = this.state;
    const { onChange } = this.props;
    const { handleGradeSelectDisabled } = this.props;
    let newData;
    // 移除父表格一行
    if (!this.containBar(key)) {
      const removeData = this.getRowByKey(key);
      handleGradeSelectDisabled(removeData.gradeId.key);
      newData = data.filter(item => item.key !== key);
    }

    // 移除子表格一行
    else {
      const keyArray = key.split('-');
      const dataItem = data.filter(item => item.key === keyArray[0])[0];
      const newChildrenData = dataItem.childrenData.filter(
        item => item.key.split('-')[1] !== keyArray[1]
      );
      newData = data.map(item => ({ ...item }));
      newData.forEach(item => {
        if (item.key === keyArray[0]) {
          item.childrenData = newChildrenData;

        }
      });
    }
    this.setState({ data: newData });
    onChange(newData);
  }
  

  // 子表格
  expandedRowRender(parentRecord) {
    const { childrenData = [] } = parentRecord;
    const columns = [
      {
        dataIndex: 'timeRange',
        key: 'timeRange',
        render: (text, record) => {
          if (record.editable) {
            if (text && text.startHour && text.endHour) {
              return (
                <div>
                  <TimePicker
                    defaultValue={moment(text.startHour, timeFormat)}
                    onChange={value => this.handleFieldChange(value, 'startHour', record.key)}
                    size="small"
                    placeholder="开始时间"
                    style={{ width: '100%' }}
                    getPopupContainer={trigger => trigger.parentNode}
                  />
                  <TimePicker
                    defaultValue={moment(text.endHour, timeFormat)}
                    onChange={value => this.handleFieldChange(value, 'endHour', record.key)}
                    size="small"
                    placeholder="结束时间"
                    style={{ width: '100%' }}
                    getPopupContainer={trigger => trigger.parentNode}
                  />
                </div>
              );
            }
            return (
              <div>
                <TimePicker
                  onChange={value => this.handleFieldChange(value, 'startHour', record.key)}
                  size="small"
                  placeholder="开始时间"
                  style={{ width: '100%' }}
                  getPopupContainer={trigger => trigger.parentNode}
                />
                <TimePicker
                  onChange={value => this.handleFieldChange(value, 'endHour', record.key)}
                  size="small"
                  placeholder="结束时间"
                  style={{ width: '100%' }}
                  getPopupContainer={trigger => trigger.parentNode}
                />
              </div>
            );
          }
          return `${text.startHour}~${text.endHour}`;
        },
        title: '起止时间',
        width: '25%',
      },
      {
        dataIndex: 'day',
        key: 'day',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Select
                mode="multiple"
                defaultValue={text}
                onChange={value => this.handleFieldChange(value, 'day', record.key)}
                style={{ width: 180 }}
                placeholder="星期"
              >
                {globalData.weekendData.map(item => (
                  <Option key={item} value={item}>
                    {item}
                  </Option>
                ))}
              </Select>
            );
          }
          return text.join(',');
        },
        title: '星期',
        width: '45%',
      },

      {
        key: 'action',
        render: (text, record) => {
          const { parentTableLoading } = this.state;
          if (!!record.editable && parentTableLoading) {
            return null;
          }
          return this.operateActionRender(record);
        },
        title: '操作',
      },
    ];
    return (
      <Fragment>
        <Table dataSource={childrenData} columns={columns} pagination={false} />
        <Button
          style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
          type="dashed"
          icon="plus"
          onClick={() => this.newChildrenMember(parentRecord.key)}
        >
          新增
        </Button>
      </Fragment>
    );
  }

  // 操作
  operateActionRender(record) {
    if (record.editable) {
      if (record.isNew) {
        return (
          <span>
            <a onClick={e => this.saveRow(e, record.key)}>添加</a>
            <Divider type="vertical" />
            <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
              <a>删除</a>
            </Popconfirm>
          </span>
        );
      }
      return (
        <span>
          <a onClick={e => this.saveRow(e, record.key)}>保存</a>
          <Divider type="vertical" />
          <a onClick={e => this.cancel(e, record.key)}>取消</a>
        </span>
      );
    }
    return (
      <span>
        <a onClick={e => this.toggleEditable(e, record.key)}>编辑</a>
        <Divider type="vertical" />
        <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
          <a>删除</a>
        </Popconfirm>
      </span>
    );
  }

  render() {
    const { gradeSelectData = [] } = this.props;
    const { parentTableLoading, data = [] } = this.state;
    const columns = [
      {
        dataIndex: 'gradeId',
        key: 'gradeId',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Select
                defaultValue={text}
                onChange={value => this.handleFieldChange(value, 'gradeId', record.key)}
                labelInValue
                style={{ width: 100 }}
                placeholder="班级"
              >
                {gradeSelectData.map(item => (
                  <Option key={item.value} value={item.value} disabled={item.disabled}>
                    {item.label}
                  </Option>
                ))}
              </Select>
            );
          }
          return text.label;
        },
        title: '班级',
        width: '20%',
      },
      {
        dataIndex: 'dateRange',
        key: 'dateRange',
        render: (text, record) => {
          if (record.editable) {
            if (text && text.startDate && text.endDate) {
              return (
                <RangePicker
                  disabledDate={this.disabledDate}
                  defaultValue={[
                    moment(text.startDate, dateFormat),
                    moment(text.endDate, dateFormat),
                  ]}
                  onChange={value => this.handleFieldChange(value, 'dateRange', record.key)}
                  placeholder={['开始日期', '结束日期']}
                  style={{ width: '100%' }}
                  getPopupContainer={trigger => trigger.parentNode}
                />
              );
            }
            return (
              <RangePicker
                disabledDate={this.disabledDate}
                onChange={value => this.handleFieldChange(value, 'dateRange', record.key)}
                placeholder={['开始日期', '结束日期']}
                style={{ width: '100%' }}
                getPopupContainer={trigger => trigger.parentNode}
              />
            );
          }
          return `${text.startDate}~${text.endDate}`;
        },
        title: '起止日期',
        width: '45%',
      },
      {
        key: 'action',
        render: (text, record) => {
          if (!!record.editable && parentTableLoading) {
            return null;
          }
          return this.operateActionRender(record);
        },
        title: '操作',
      },
    ];

    return (
      <Fragment>
        <Table
          loading={parentTableLoading}
          columns={columns}
          dataSource={data}
          pagination={false}
          expandedRowRender={this.expandedRowRender}
          rowClassName={record => (record.editable ? styles.editable : '')}
        />
        <Button
          style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
          type="dashed"
          onClick={this.newMember}
          icon="plus"
        >
          新增
        </Button>
      </Fragment>
    );
  }
}

export default NestTableForm;
