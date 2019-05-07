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
  InputNumber,
  DatePicker,
  Badge,
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

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

const ShowViewModal = props => {
  const { showModalVisible, handleShowModalVisible, current = {} } = props;

  return (
    <Modal
      destroyOnClose
      title="体验课查看"
      visible={showModalVisible}
      onCancel={() => handleShowModalVisible()}
      cancelText="关闭"
      footer={null}
    >
      <Card bordered={false}>
        <DescriptionList size="small" title="基本信息" col={2}>
          <Description term="课程名称">{current.title}</Description>
          <Description term="课程价格">{current.money}</Description>
          <Description term="截至时间">
            {moment(current.signUpEndDate).format('YYYY-MM-DD')}
          </Description>
          <Description term="联系电话">{current.telephone}</Description>
          <Divider />
          <DescriptionList col={2} title="课程介绍" size="small" style={{ marginTop: 5 }}>
            <Description>{current.introduction}</Description>
          </DescriptionList>
          <Divider />
          <Description term="宣传照片">
            <img
              alt="example"
              style={{ width: '100%' }}
              src={globalData.photoBaseUrl + current.photoUrl}
            />
          </Description>
        </DescriptionList>
      </Card>
    </Modal>
  );
};

const CreateForm = Form.create()(props => {
  const { modalVisible, handleAddAndEdit, form, handleAddModalVisible, current = {} } = props;
  const {
    form: { getFieldDecorator },
  } = props;

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      const formData = {
        ...fieldsValue,
        signUpEndDate: moment(fieldsValue.signUpEndDate).format('YYYY-MM-DD'),
        // photoUrl: fieldsValue.photoUrl.length === 1 ? fieldsValue.photoUrl : '',
      };
      handleAddAndEdit(formData);
    });
  };

  // 当前天之前禁用
  const disabledDate = currentDate => currentDate < moment().endOf('day');
  return (
    <Modal
      destroyOnClose
      title={`体验课${current.id ? '编辑' : '添加'}`}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleAddModalVisible()}
    >
      <FormItem>
        {getFieldDecorator('id', {
          initialValue: current.id,
        })(<Input type="hidden" />)}
      </FormItem>
      <FormItem label="课程名称" {...formLayout}>
        {getFieldDecorator('title', {
          rules: [{ required: true, message: '请输入不超过十五位课程名称！', max: 15 }],
          initialValue: current.title,
        })(<Input placeholder="请输入课程名称" />)}
      </FormItem>
      <FormItem label="价格" {...formLayout}>
        {getFieldDecorator('money', {
          rules: [{ required: true, message: '请输入价格！' }],
          initialValue: current.money,
        })(<InputNumber style={{ width: 255 }} min={0} placeholder="请输入价格" />)}
      </FormItem>
      <FormItem label="截至报名时间" {...formLayout}>
        {getFieldDecorator('signUpEndDate', {
          rules: [{ required: true, message: '请选择截至报名时间！' }],
          initialValue: moment(current.signUpEndDate),
        })(<DatePicker disabledDate={disabledDate} placeholder="请选择时间" />)}
      </FormItem>
      <FormItem label="联系电话" {...formLayout}>
        {getFieldDecorator('telephone', {
          rules: [{ required: true, message: '请输入联系电话！' }],
          initialValue: current.telephone,
        })(<Input placeholder="请输入联系电话" />)}
      </FormItem>
      <FormItem label="宣传照片" {...formLayout}>
        <UpLoadPicExample
          props={props}
          formFieldPropsKey="photoUrl"
          defaultImgUrl={current.photoUrl}
          fileUpLoadDirectoryName={globalData.fileUpLoadDirectoryName.experienceCourse}
        />
      </FormItem>
      <FormItem label="课程介绍" {...formLayout}>
        {getFieldDecorator('introduction', {
          rules: [{ message: '请输入至少五个字符的介绍！', min: 5, max: 500 }],
          initialValue: current.introduction,
        })(<TextArea rows={4} placeholder="请输入至少五个字符" />)}
      </FormItem>
    </Modal>
  );
});

// 忽略停课,开课
const statusMap = ['error', 'processing', 'success', 'default'];
const status = ['停课', '报名', '开课', '结课'];

/* eslint react/no-multi-comp:0 */
@connect(({ experienceCourse, loading }) => ({
  experienceCourse,
  loading: loading.models.experienceCourse,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: [],
    current: {},
    showModalVisible: false,
  };

  columns = [
    {
      title: '课程名称',
      dataIndex: 'title',
    },
    {
      title: '价格',
      dataIndex: 'money',
    },
    {
      title: '课程状态',
      dataIndex: 'status',
      render(val) {
        return <Badge status={statusMap[val]} text={status[val]} />;
      },
    },
    {
      title: '截止报名时间',
      dataIndex: 'signUpEndDate',
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
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
          <a onClick={() => this.handleEndCourse(record)}>结课</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'experienceCourse/fetchList',
    });
  }

  // 处理表格分页
  handleStandardTableChange = pagination => {
    const { dispatch } = this.props;

    dispatch({
      type: 'experienceCourse/save',
      payload: {
        ...pagination,
      },
    });
  };

  // 搜索条件重置
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({});
    dispatch({
      type: 'experienceCourse/fetchList',
      payload: {},
    });
  };

  // 删除多行
  handleDeleteRows = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    if (!selectedRows) return;
    dispatch({
      type: 'experienceCourse/remove',
      payload: {
        idsStr: selectedRows.map(row => row.id).join(','),
      },
      callback: response => {
        this.handleResultData(response);
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
        type: 'experienceCourse/fetchList',
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
      type: 'experienceCourse/addAndUpdate',
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
      title: '删除体验课',
      content: '确定删除该体验课吗？',
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
      type: 'experienceCourse/remove',
      payload: {
        idsStr,
      },
      callback: response => {
        this.handleResultData(response);
      },
    });
  };

  // 结课处理
  handleEndCourse = record => {
    // 报名截止前，不能结课
    const { id, signUpEndDate } = record;
    const dateNow = moment();
    const dateDiff = dateNow.diff(moment(signUpEndDate), 'days');
    if (dateDiff <= 1) {
      message.warning(`请在截止报名时间${moment(signUpEndDate).format('YYYY-MM-DD')}一天后结课!`);
      return;
    }

    const { dispatch } = this.props;
    dispatch({
      type: 'experienceCourse/addAndUpdate',
      payload: {
        id,
        status: 3, // 结课状态
      },
      callback: response => {
        if (globalData.successCode === response.status) {
          dispatch({
            type: 'experienceCourse/fetchList',
          });
          message.success(response.msg);
        } else message.error(response.msg);
      },
    });
  };

  // 添加、编辑、删除返回结果处理
  handleResultData = response => {
    const { dispatch } = this.props;
    if (globalData.successCode === response.status) {
      dispatch({
        type: 'experienceCourse/fetchList',
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
            <FormItem label="体验课名称">{getFieldDecorator('title')(<Input />)}</FormItem>
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
      experienceCourse: { list, pagination },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, current, showModalVisible } = this.state;

    const parentMethods = {
      handleAddAndEdit: this.handleAddAndEdit,
      handleAddModalVisible: this.handleAddModalVisible,
    };

    return (
      <PageHeaderWrapper title="体验课管理">
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
        <CreateForm {...parentMethods} modalVisible={modalVisible} current={current} />
        <ShowViewModal
          showModalVisible={showModalVisible}
          current={current}
          handleShowModalVisible={this.handleShowModalVisible}
        />
      </PageHeaderWrapper>
    );
  }
}

export default TableList;
