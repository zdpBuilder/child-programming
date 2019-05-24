import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Modal,
  message,
  Divider,
  Select,
  Badge,
  Calendar,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import DescriptionList from '@/components/DescriptionList';

import styles from '@/layouts/TableList.less';
import globalData from '@/utils/globalData';
import UpLoadPicExample from '@/components/UpLoad/UpLoadPicExample';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Description } = DescriptionList;
const { Option } = Select;

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

const ShowViewModal = props => {
  const { showModalVisible, handleShowModalVisible, current = {} } = props;

  return (
    <Modal
      destroyOnClose
      title="老师查看"
      visible={showModalVisible}
      onCancel={() => handleShowModalVisible()}
      cancelText="关闭"
      footer={null}
    >
      <Card bordered={false}>
        <DescriptionList size="small" title="基本信息" col={2}>
          <Description term="登陆账号">{current.loginId}</Description>
          <Description term="姓名">{current.name}</Description>
          <Description term="手&nbsp;&nbsp;机&nbsp;&nbsp;号">{current.phone}</Description>
          <Description term="权限名称">{current.roleName}</Description>

          <Divider />
          <Description term="照&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;片">
            <img
              alt="example"
              style={{ width: '100%' }}
              src={globalData.photoBaseUrl + current.photoUrl}
            />
          </Description>
          <Divider />
          <DescriptionList col={2} title="个人简介" size="small" style={{ marginTop: 5 }}>
            <Description>{current.introduction}</Description>
          </DescriptionList>
        </DescriptionList>
      </Card>
    </Modal>
  );
};

const CreateForm = Form.create()(props => {
  const { modalVisible, handleAddAndEdit, form, handleAddModalVisible, current = {} } = props;
  const {
    form: { getFieldDecorator },
    roleListData,
  } = props;

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAddAndEdit(fieldsValue);
    });
  };

  return (
    <Modal
      destroyOnClose
      title={`老师${current.id ? '编辑' : '添加'}`}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleAddModalVisible()}
    >
      <FormItem>
        {getFieldDecorator('id', {
          initialValue: current.id,
        })(<Input type="hidden" />)}
      </FormItem>
      <FormItem label="登陆账号" {...formLayout}>
        {getFieldDecorator('loginId', {
          rules: [{ required: false, message: '请输入不超过十五位登陆账号！', max: 15 }],
          initialValue: current.loginId,
        })(<Input placeholder="请输入登陆账号" />)}
      </FormItem>
      <FormItem label="角色名称" {...formLayout}>
        {getFieldDecorator('roleId', {
          rules: [{ required: true, message: '请选择角色！' }],
          initialValue: current.roleId,
        })(
          <Select placeholder="请选择角色" style={{ width: 255 }}>
            {roleListData.map(item => (
              <Option key={item.value} value={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        )}
      </FormItem>

      <FormItem label="姓名" {...formLayout}>
        {getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入不超过十五位姓名！', max: 15 }],
          initialValue: current.name,
        })(<Input placeholder="请输入姓名" />)}
      </FormItem>
      <FormItem label="手机号" {...formLayout}>
        {getFieldDecorator('phone', {
          rules: [{ required: true, message: '请输入正确手机号！', max: 11, min: 11 }],
          initialValue: current.phone,
        })(<Input placeholder="请输入手机号" />)}
      </FormItem>
      <FormItem label="照片" {...formLayout}>
        <UpLoadPicExample
          props={props}
          formFieldPropsKey="photoUrl"
          defaultImgUrl={current.photoUrl}
          fileUpLoadDirectoryName={globalData.fileUpLoadDirectoryName.teacher}
        />
      </FormItem>
      <FormItem label="个人介绍" {...formLayout}>
        {getFieldDecorator('introduction', {
          rules: [{ message: '请输入至少五个字符的介绍！', min: 5, max: 500 }],
          initialValue: current.introduction,
        })(<TextArea rows={4} placeholder="请输入至少五个字符" />)}
      </FormItem>
    </Modal>
  );
});

const dateFormat = 'YYYY-MM-DD';
const timeFormat = 'HH:mm:ss';

// 课程表展示
const ShowScheduleCalendarModal = props => {
  const {
    current = {},
    scheduleCalendarModalVisible,
    handleScheduleCalendarModalVisible,
    courseSchduleList,
  } = props;
  // 根据日期，获取当天课程
  const getRowByDate = value => {
    const date = value.format(dateFormat);
    const result = courseSchduleList.filter(
      item => date === moment(item.startTime).format(dateFormat)
    );
    return result;
  };

  const getListData = value => {
    const currentScheduleList = getRowByDate(value);
    const listData = [];
    if (currentScheduleList.length > 0) listData.push({ type: 'warning' });
    return listData || [];
  };

  // 日期渲染
  const dateCellRender = value => {
    const listData = getListData(value);
    return (
      <ul>
        {listData.map(item => (
          <li key={item.content}>
            <Badge status={item.type} />
          </li>
        ))}
      </ul>
    );
  };

  // 处理日期选择
  const handleDateSelect = value => {
    const currentScheduleList = getRowByDate(value);
    if (currentScheduleList.length > 0) {
      Modal.info({
        title: '课程安排',
        okText: '关闭',
        content: (
          <div>
            {currentScheduleList.map(item => (
              <div key={item.id}>
                {`${current.courseName}, ${current.gradeName}, 课时${item.period}, ${moment(
                  item.startTime
                ).format(timeFormat)}~${moment(item.endTime).format(timeFormat)}`}
              </div>
            ))}
          </div>
        ),
      });
    }
  };
  return (
    <Modal
      destroOnClose
      width={1000}
      title="课程表"
      visible={scheduleCalendarModalVisible}
      onCancel={() => handleScheduleCalendarModalVisible(false)}
      footer={null}
    >
      <Calendar dateCellRender={dateCellRender} onSelect={handleDateSelect} />
    </Modal>
  );
};

/* eslint react/no-multi-comp:0 */
@connect(({ teacher, loading }) => ({
  teacher,
  loading: loading.models.teacher,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: [],
    current: {},
    showModalVisible: false,
    scheduleCalendarModalVisible: false,
  };

  columns = [
    {
      title: '登陆账号',
      dataIndex: 'loginId',
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '电话',
      dataIndex: 'phone',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleShowModalVisible(true, record)}>查看</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleEditModalVisible(true, record)}>编辑</a>
          <Divider type="vertical" />
          <a onClick={() => this.deleteOne(record.id)}>删除</a>
          <Divider type="vertical" />
          <a onClick={() => this.resetPassword(record.id)}>重置密码</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleScheduleCalendarModalVisible(true, record.id)}>课程表</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'teacher/fetchList',
    });
    dispatch({
      type: 'teacher/fetchRoleList',
    });
  }

  // 查看学生课表
  handleScheduleCalendarModalVisible = (flag, teacherId) => {
    // 如果flag为true，则请求该学生课表数据
    if (flag) {
      const { dispatch } = this.props;
      dispatch({
        type: 'teacher/fetchCourseScheduleList',
        payload: {
          teacherId,
        },
        callback: response => {
          if (!response || !response.length > 0) message.error('暂无课程表');
        },
      });
    }
    this.setState({
      scheduleCalendarModalVisible: !!flag,
    });
  };

  // 处理表格分页
  handleStandardTableChange = pagination => {
    const { dispatch } = this.props;

    dispatch({
      type: 'teacher/save',
      payload: {
        pagination,
      },
    });
  };

  // 搜索条件重置
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({});
    dispatch({
      type: 'teacher/fetchList',
      payload: {},
    });
  };

  // 删除多行
  handleDeleteRows = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    if (!selectedRows) return;
    dispatch({
      type: 'teacher/remove',
      payload: {
        idsStr: selectedRows.map(row => row.id).join(','),
      },
      callback: response => {
        this.handleDeleteResultData(response);
        this.setState({
          selectedRows: [],
        });
      },
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  // 按条件搜索
  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
      };

      dispatch({
        type: 'teacher/fetchList',
        payload: values,
      });
    });
  };

  // 添加弹出框
  handleAddModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      current: undefined,
    });
  };

  //  编辑弹出框
  handleEditModalVisible = (flag, item) => {
    this.setState({
      modalVisible: !!flag,
      current: item,
    });
  };

  // 添加、编辑处理
  handleAddAndEdit = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'teacher/addAndUpdate',
      payload: {
        ...fields,
      },
      callback: response => {
        this.handleResultData(response);
      },
    });
  };

  //  查看弹出框
  handleShowModalVisible = (flag, item) => {
    this.setState({
      showModalVisible: !!flag,
      current: item,
    });
  };

  // 删除单个提示
  deleteOne = id => {
    Modal.confirm({
      title: '删除老师',
      content: '确定删除该老师吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.handleDeleteItem(id),
    });
  };

  // 删除单个处理
  handleDeleteItem = id => {
    const idsStr = `${id}`;
    const { dispatch } = this.props;
    dispatch({
      type: 'teacher/remove',
      payload: {
        idsStr,
      },
      callback: response => {
        this.handleDeleteResultData(response);
      },
    });
  };

  // 删除返回结果处理
  handleDeleteResultData = response => {
    if (globalData.successCode === response.status) {
      const { dispatch } = this.props;
      dispatch({
        type: 'teacher/fetchList',
      });
      message.success(response.msg);
    } else if (globalData.failCode === response.status && response.data) {
      const { data } = response;
      Modal.warning({
        title: '删除失败',
        okText: '关闭',
        content: (
          <div>
            {data.map(item => (
              <div key={item.id}>{`${item.name}占用该老师`}</div>
            ))}
          </div>
        ),
      });
    }
  };

  // 重置密码
  resetPassword = teacherId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'teacher/resetPassword',
      payload: {
        teacherId,
      },
      callback: response => {
        this.handleResultData(response);
      },
    });
  };

  // 添加、编辑、删除返回结果处理
  handleResultData = response => {
    const { dispatch } = this.props;
    if (globalData.successCode === response.status) {
      dispatch({
        type: 'teacher/fetchList',
      });
      message.success(response.msg);
      this.handleAddModalVisible();
    } else message.error(response.msg);
  };

  // 搜索
  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="老师姓名">{getFieldDecorator('name')(<Input />)}</FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      teacher: { list, pagination, roleListData, courseSchduleList },
      loading,
    } = this.props;
    const {
      selectedRows,
      modalVisible,
      current,
      showModalVisible,
      scheduleCalendarModalVisible,
    } = this.state;

    const parentMethods = {
      handleAddAndEdit: this.handleAddAndEdit,
      handleAddModalVisible: this.handleAddModalVisible,
    };

    return (
      <PageHeaderWrapper title="教师信息管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleAddModalVisible(true)}>
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button onClick={this.handleDeleteRows}>批量删除</Button>
                </span>
              )}
            </div>
            <StandardTable
              rowKey="id"
              selectedRows={selectedRows}
              loading={loading}
              data={list}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              paginationData={pagination}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm
          {...parentMethods}
          modalVisible={modalVisible}
          current={current}
          roleListData={roleListData}
        />
        <ShowViewModal
          showModalVisible={showModalVisible}
          current={current}
          handleShowModalVisible={this.handleShowModalVisible}
        />
        {courseSchduleList.length > 0 && (
          <ShowScheduleCalendarModal
            current={current}
            scheduleCalendarModalVisible={scheduleCalendarModalVisible}
            handleScheduleCalendarModalVisible={this.handleScheduleCalendarModalVisible}
            courseSchduleList={courseSchduleList}
          />
        )}
      </PageHeaderWrapper>
    );
  }
}

export default TableList;
