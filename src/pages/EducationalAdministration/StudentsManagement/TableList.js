/* eslint-disable react/jsx-curly-brace-presence */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Button, Modal, message, Divider, Radio } from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import DescriptionList from '@/components/DescriptionList';

import styles from '@/layouts/TableList.less';
import globalData from '@/utils/globalData';
import UpLoadPicExample from '@/components/UpLoad/UpLoadPicExample';

const FormItem = Form.Item;
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
      title="学生信息查看"
      visible={showModalVisible}
      onCancel={() => handleShowModalVisible()}
      cancelText="关闭"
      footer={null}
    >
      <Card bordered={false}>
        <DescriptionList title="学生基本信息" size="small" col={2} style={{ marginLeft: 0 }}>
          <Description term="学生姓名">{current.name}</Description>
          <Description term="学生性别">{current.sex}</Description>
          <Description term="学生年龄">{current.age}</Description>
          <Description term="家庭住址">{current.address}</Description>
          <Description term="学生头像">
            <img
              alt="example"
              style={{ width: '100%' }}
              src={globalData.photoBaseUrl + current.photoUrl}
            />
          </Description>
        </DescriptionList>
        <Divider />
        <DescriptionList col={2} title="监护人基本信息">
          <Description term="监护人姓名">{current.guardianName}</Description>
          <Description term="监护人电话">{current.guardianPhone}</Description>
          <Description term="监护人邮箱">{current.email}</Description>
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
      handleAddAndEdit(fieldsValue);
    });
  };

  return (
    <Modal
      destroyOnClose
      title={`学生${current.id ? '编辑' : '添加'}`}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleAddModalVisible()}
    >
      <FormItem>
        {getFieldDecorator('id', {
          initialValue: current.id,
        })(<Input type="hidden" />)}
      </FormItem>
      <FormItem label="学生姓名" {...formLayout}>
        {getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入学生姓名！', max: 50 }],
          initialValue: current.name,
        })(<Input placeholder="请输入学生姓名" />)}
      </FormItem>
      <FormItem label="学生性别" {...formLayout}>
        {getFieldDecorator('sex', {
          initialValue: current.sex,
        })(
          <Radio.Group>
            <Radio value={1}>男</Radio>
            <Radio value={2}>女</Radio>
          </Radio.Group>
        )}
      </FormItem>
      <FormItem label="学生头像" {...formLayout}>
        <UpLoadPicExample
          props={props}
          formFieldPropsKey="photoUrl"
          defaultImgUrl={current.photoUrl}
          fileUpLoadDirectoryName={globalData.fileUpLoadDirectoryName.student}
        />
      </FormItem>
      <FormItem label="学生年龄" {...formLayout}>
        {getFieldDecorator('age', {
          rules: [{ required: true, message: '请输入监护人年龄！', max: 50 }],
          initialValue: current.age,
        })(<Input placeholder="请输入学生年龄" />)}
      </FormItem>
      <FormItem label="学生地址" {...formLayout}>
        {getFieldDecorator('address', {
          rules: [{ required: true, message: '请输入学生地址！', max: 50 }],
          initialValue: current.address,
        })(<Input placeholder="请输入学生地址" />)}
      </FormItem>

      <FormItem label="监护人姓名" {...formLayout}>
        {getFieldDecorator('guardianName', {
          rules: [{ required: true, message: '请输入监护人姓名！', max: 50 }],
          initialValue: current.guardianName,
        })(<Input placeholder="请输入监护人邮箱" />)}
      </FormItem>
      <FormItem label="监护人电话" {...formLayout}>
        {getFieldDecorator('guardianPhone', {
          rules: [{ required: true, message: '请输入监护人电话！', max: 50 }],
          initialValue: current.guardianPhone,
        })(<Input placeholder="请输入监护人电话" />)}
      </FormItem>
      <FormItem label="监护人邮箱" {...formLayout}>
        {getFieldDecorator('email', {
          rules: [{ required: true, message: '请输入监护人邮箱！', max: 50 }],
          initialValue: current.email,
        })(<Input placeholder="请输入监护人邮箱" />)}
      </FormItem>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ student, loading }) => ({
  student,
  loading: loading.models.student,
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
      title: '学生姓名',
      dataIndex: 'name',
    },
    {
      title: '学生性别',
      dataIndex: 'sex',
      render: val => <span>{val === 1 ? '男' : '女'}</span>,
    },

    {
      title: '学生年龄',
      dataIndex: 'age',
      render: val => <span>{val}岁</span>,
    },

    {
      title: '监护人姓名',
      dataIndex: 'guardianName',
    },
    {
      title: '监护人电话',
      dataIndex: 'guardianPhone',
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
          <a onClick={() => this.deleteStudent(record.id)}>删除</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'student/fetchList',
    });
  }

  // 处理表格分页
  handleStandardTableChange = pagination => {
    const { dispatch } = this.props;

    dispatch({
      type: 'student/save',
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
      type: 'student/fetchList',
      payload: {},
    });
  };

  // 删除多行
  handleDeleteRows = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    if (!selectedRows) return;
    dispatch({
      type: 'student/remove',
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
        type: 'student/fetchList',
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
      type: 'student/addAndUpdate',
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
  deleteStudent = id => {
    Modal.confirm({
      title: '删除学生',
      content: '确定删除该学生吗？',
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
      type: 'student/remove',
      payload: {
        idsStr,
      },
      callback: response => {
        this.handleResultData(response);
      },
    });
  };

  // 添加、编辑、删除返回结果处理
  handleResultData = response => {
    console.log(response);
    const { dispatch } = this.props;
    if (globalData.successCode === response.status) {
      dispatch({
        type: 'student/fetchList',
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
            <FormItem label="学生姓名">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
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
      student: { list, pagination },
      loading,
    } = this.props;
    console.log(loading);
    const { selectedRows, modalVisible, current, showModalVisible } = this.state;

    const parentMethods = {
      handleAddAndEdit: this.handleAddAndEdit,
      handleAddModalVisible: this.handleAddModalVisible,
    };

    return (
      <PageHeaderWrapper title="学生管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div className={styles.tableListOperator}>
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
