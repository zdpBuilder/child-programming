import React, { PureComponent, Fragment } from 'react';
import { Table, Button, message, Popconfirm, Divider, Select, TimePicker, DatePicker } from 'antd';
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

  cacheOriginData = {};

  constructor(props) {
    super(props);
    this.expandedRowRender = this.expandedRowRender.bind(this);
    const { isShow = false } = props;
    // 深复制
    const initialData = JSON.parse(JSON.stringify(props.value || null));
    // 为元素加key
    if (initialData && !isShow) {
      initialData.forEach(item => {
        const element = item;
        element.key = `${parentColumnIdPrefix}_${this.index}`;
        this.index += 1;
        item.childrenData.forEach(childrenItem => {
          const childrenElement = childrenItem;
          childrenElement.key = `${element.key}-${childrenColumnIdPrefix}_${this.childrenIndex}`;
          this.childrenIndex += 1;
        });
      });
    }
    this.state = {
      data: initialData || [],
      parentTableLoading: false,
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
  };

  // 是否含有分隔符 -
  containBar = key => (key ? key.indexOf('-') !== -1 : false);

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

  // 当前天之前禁用
  disabledDate = current => current < moment().endOf('day');

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
      gradeSelect: {},
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
      isNew: true,
      editable: true,
      key: `${parentRecordKey}-${childrenColumnIdPrefix}_${this.childrenIndex}`,
      timeRange: {},
    });
    this.childrenIndex += 1;
    const newData = data.map(item => ({ ...item }));
    newData.forEach(item => {
      if (item.key === parentRecordKey) {
        const element = item;
        element.childrenData = newchildren;
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
        if (value) target.timeRange[fieldName] = value.format(timeFormat);
      }
      // 日期
      // TODO 此处日期限制后，无法清除DateRange控件的内容
      else if (fieldName === 'dateRange') {
        if (!value || value.length !== 2) return;

        if (value[0].isoWeekday() !== 1) {
          message.warning('请选择周一日期开始');
          return;
        }
        if (value[1].isoWeekday() !== 7) {
          message.warning('请选择周日日期结束');
          return;
        }
        target[fieldName] = {
          startDate: value[0].format(dateFormat),
          endDate: value[1].format(dateFormat),
        };
      } else {
        target[fieldName] = value;
      }
      this.setState({ data: newData });
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
      // TODO 未校验同一天的时间范围选择
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
        // 同一天时间范围冲突校验
        const result = this.detectDayTimeRangeConfict(key, target);
        if (!result) {
          message.warning('当天时间安排有冲突,无法保存!');
          this.setState({
            parentTableLoading: false,
          });
          return;
        }
      } else if (!target.gradeSelect.key || !target.dateRange.startDate) {
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
      const { onChange } = this.props;
      const { data } = this.state;
      onChange(data);
      this.setState({
        parentTableLoading: false,
      });
    }, 500);
  }

  // 同一天时间范围冲突校验，不能有交叉
  detectDayTimeRangeConfict(key, target) {
    const keyArray = key.split('-');
    const { childrenData = [] } = this.getRowByKey(keyArray[0]);
    console.log(childrenData);
    // 只有一个不用校验
    if (childrenData.length === 1) return true;
    // 取出当前要保存的班级星期安排
    const { day: targeDay } = target;
    const result = childrenData.every(children => {
      const { day } = children;
      return day.every(dayStr =>
        targeDay.every(targeDayStr => {
          if (dayStr === targeDayStr) {
            if (
              target.timeRange.endHour < children.timeRange.startHour ||
              target.timeRange.startHour > children.timeRange.endHour
            )
              return true;
            return false;
          }
          return true;
        })
      );
    });
    return result;
  }

  // 取消
  cancel(e, key) {
    this.clickedCancel = true;
    e.preventDefault();
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (this.cacheOriginData[key]) {
      Object.assign(target, this.cacheOriginData[key]);
      delete this.cacheOriginData[key];
    }
    target.editable = false;
    this.setState({ data: newData });
    this.clickedCancel = false;
  }

  // 回车键
  handleKeyPress(e, key) {
    if (e.key === 'Enter') {
      this.saveRow(e, key);
    }
  }

  // 移除一行
  remove(key) {
    const { data } = this.state;
    const { onChange } = this.props;
    let newData;
    // 移除父表格一行
    if (!this.containBar(key)) {
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
          const element = item;
          element.childrenData = newChildrenData;
        }
      });
    }
    this.setState({ data: newData });
    onChange(newData);
  }

  // 子表格
  expandedRowRender(parentRecord, isShow) {
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
    ];
    if (!isShow) {
      const action = {
        key: 'action',
        render: (text, record) => {
          const { parentTableLoading } = this.state;
          if (!!record.editable && parentTableLoading) {
            return null;
          }
          return this.operateActionRender(record);
        },
        title: '操作',
      };
      columns.push(action);
    }
    const ChildrenAddButton = () => {
      if (!isShow) {
        return (
          <Button
            style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
            type="dashed"
            icon="plus"
            onClick={() => this.newChildrenMember(parentRecord.key)}
          >
            新增
          </Button>
        );
      }
      return <div />;
    };
    return (
      <Fragment>
        <Table dataSource={childrenData} columns={columns} pagination={false} />
        <ChildrenAddButton />
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
    const { gradeSelectData = [], isShow = false } = this.props;
    const { parentTableLoading, data = [] } = this.state;
    const columns = [
      {
        dataIndex: 'gradeSelect',
        key: 'gradeSelect',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Select
                defaultValue={text}
                onChange={value => this.handleFieldChange(value, 'gradeSelect', record.key)}
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
    ];

    // 操作按钮
    if (!isShow) {
      const action = {
        key: 'action',
        render: (text, record) => {
          if (!!record.editable && parentTableLoading) {
            return null;
          }
          return this.operateActionRender(record);
        },
        title: '操作',
      };
      columns.push(action);
    }

    // 新增按钮
    const ParentAddButton = () => {
      if (!isShow)
        return (
          <Button
            style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
            type="dashed"
            onClick={this.newMember}
            icon="plus"
          >
            新增
          </Button>
        );
      return <div />;
    };

    return (
      <Fragment>
        <Table
          rowKey="id"
          loading={parentTableLoading}
          columns={columns}
          dataSource={data}
          pagination={false}
          expandedRowRender={record => this.expandedRowRender(record, isShow)}
          rowClassName={record => (record.editable ? styles.editable : '')}
        />
        <ParentAddButton />
      </Fragment>
    );
  }
}

export default NestTableForm;
