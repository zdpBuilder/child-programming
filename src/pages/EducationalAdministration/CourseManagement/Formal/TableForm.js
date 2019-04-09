import React, { PureComponent, Fragment } from 'react';
import { Table, Button, message, Popconfirm, Divider, Select, TimePicker } from 'antd';
import moment from 'moment';
import isEqual from 'lodash/isEqual';
import styles from './style.less';

import globalData from '@/utils/globalData';

const { Option } = Select;

class TableForm extends PureComponent {
  index = 0;

  cacheOriginData = {};

  constructor(props) {
    super(props);

    this.state = {
      data: props.value,
      loading: false,
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

  getRowByKey(key, newData) {
    const { data } = this.state;
    return (newData || data).filter(item => item.key === key)[0];
  }

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

  newMember = () => {
    const { data = [] } = this.state;
    const newData = data.map(item => ({ ...item }));
    newData.push({
      key: `NEW_TEMP_ID_${this.index}`,
      day: [],
      startHour: [],
      endHour: [],
      editable: true,
      isNew: true,
    });
    this.index += 1;
    this.setState({ data: newData });
  };

  remove(key) {
    const { data } = this.state;
    const { onChange } = this.props;
    const newData = data.filter(item => item.key !== key);
    this.setState({ data: newData });
    onChange(newData);
  }

  handleKeyPress(e, key) {
    if (e.key === 'Enter') {
      this.saveRow(e, key);
    }
  }

  handleFieldChange(value, fieldName, key, timeString) {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      if (value instanceof moment) target[fieldName] = timeString;
      else target[fieldName] = value;

      this.setState({ data: newData });
    }
  }

  saveRow(e, key) {
    e.persist();
    this.setState({
      loading: true,
    });
    setTimeout(() => {
      if (this.clickedCancel) {
        this.clickedCancel = false;
        return;
      }
      const target = this.getRowByKey(key) || {};
      console.log(target);
      if (!target.gradeId || target.day.length === 0 || !target.startHour || !target.endHour) {
        message.error('请填写完整信息。');
        e.target.focus();
        this.setState({
          loading: false,
        });
        return;
      }
      delete target.isNew;
      this.toggleEditable(e, key);
      const { data } = this.state;
      const { onChange } = this.props;
      onChange(data);
      this.setState({
        loading: false,
      });
    }, 500);
  }

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

  render() {
    const { gradeSelectData = [] } = this.props;
    const columns = [
      {
        title: '班级',
        dataIndex: 'gradeId',
        key: 'gradeId',
        width: '10%',
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
                  <Option key={item.value} value={item.value}>
                    {item.label}
                  </Option>
                ))}
              </Select>
            );
          }
          return text.label;
        },
      },
      {
        title: '星期',
        dataIndex: 'day',
        key: 'day',
        width: '35%',
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
      },
      {
        title: '开始时间',
        dataIndex: 'startHour',
        key: 'startHour',
        width: '18%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <TimePicker
                defaultValue={moment(text, 'HH:mm:ss')}
                onChange={(value, timeString) =>
                  this.handleFieldChange(value, 'startHour', record.key, timeString)
                }
                placeholder="开始时间"
                style={{ width: '100%' }}
                getPopupContainer={trigger => trigger.parentNode}
              />
            );
          }
          return text;
        },
      },
      {
        title: '结束时间',
        dataIndex: 'endHour',
        key: 'endHour',
        width: '18%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <TimePicker
                defaultValue={moment(text, 'HH:mm:ss')}
                onChange={(value, timeString) =>
                  this.handleFieldChange(value, 'endHour', record.key, timeString)
                }
                placeholder="结束时间"
                style={{ width: '100%' }}
                getPopupContainer={trigger => trigger.parentNode}
              />
            );
          }
          return text;
        },
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => {
          const { loading } = this.state;
          if (!!record.editable && loading) {
            return null;
          }
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
        },
      },
    ];

    const { loading, data } = this.state;
    return (
      <Fragment>
        <Table
          loading={loading}
          columns={columns}
          dataSource={data}
          pagination={false}
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

export default TableForm;
