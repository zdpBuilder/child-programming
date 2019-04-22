import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Button, Modal, message, Divider, Select } from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import DescriptionList from '@/components/DescriptionList';

import styles from '@/layouts/TableList.less';
import globalData from '@/utils/globalData';

const FormItem = Form.Item;
const { Description } = DescriptionList;
const { Option } = Select;

const ShowViewModal = props => {
  const { showModalVisible, handleShowModalVisible, current = {} } = props;

  return (
    <Modal
      destroyOnClose
      title="体验课报名查看"
      visible={showModalVisible}
      onCancel={() => handleShowModalVisible()}
      cancelText="关闭"
      footer={null}
    >
      <Card bordered={false}>
        <DescriptionList size="small" title="基本信息" col={2}>
          <Description term="课程名称">{current.experienceCourseName}</Description>
          <Description term="学生姓名">{current.studentName}</Description>
          <Description term="联系电话">{current.studentPhone}</Description>
          <Description term="分享次数">{current.shareCounts || 0}</Description>
          <Description term="是否付费">{current.isPayment === 1 ? '是' : '否'}</Description>
          <Description term="报名时间">
            {moment(current.signUpTime).format('YYYY-MM-DD HH:mm:ss')}
          </Description>
        </DescriptionList>
      </Card>
    </Modal>
  );
};

/* eslint react/no-multi-comp:0 */
@connect(({ signUpExperienceCourse, loading }) => ({
  signUpExperienceCourse,
  loading: loading.models.signUpExperienceCourse,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    selectedRows: [],
    current: {},
    showModalVisible: false,
  };

  columns = [
    {
      title: '学生姓名',
      dataIndex: 'studentName',
    },
    {
      title: '体验课名称',
      dataIndex: 'experienceCourseName',
    },
    {
      title: '分享次数',
      dataIndex: 'shareCounts',
      render: val => <span>{val || 0}</span>,
    },
    {
      title: '电话',
      dataIndex: 'studentPhone',
    },
    {
      title: '是否付费',
      dataIndex: 'isPayment',
      render: val => <span>{val === 1 ? '是' : '否'}</span>,
    },
    {
      title: '报名时间',
      dataIndex: 'signUpTime',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleShowModalVisible(true, record)}>查看</a>
          <Divider type="vertical" />
          <a onClick={() => this.deleteOne(record.id)}>删除</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'signUpExperienceCourse/fetchList',
    });
    dispatch({
      type: 'signUpExperienceCourse/fetchRoleList',
    });
  }

  // 处理表格分页
  handleStandardTableChange = pagination => {
    const { dispatch } = this.props;

    dispatch({
      type: 'signUpExperienceCourse/save',
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
      type: 'signUpExperienceCourse/fetchList',
      payload: {},
    });
  };

  // 删除多行
  handleDeleteRows = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    if (!selectedRows) return;
    dispatch({
      type: 'signUpExperienceCourse/remove',
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
        type: 'signUpExperienceCourse/fetchList',
        payload: values,
      });
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
      title: '删除校区',
      content: '确定删除该校区吗？',
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
      type: 'signUpExperienceCourse/remove',
      payload: {
        idsStr,
      },
      callback: response => {
        this.handleResultData(response);
      },
    });
  };

  // 重置密码
  resetPassword = signUpExperienceCourseId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'signUpExperienceCourse/resetPassword',
      payload: {
        signUpExperienceCourseId,
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
        type: 'signUpExperienceCourse/fetchList',
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
          <Col md={6} sm={24}>
            <FormItem label="学生姓名">{getFieldDecorator('studentName')(<Input />)}</FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="是否付费">
              {getFieldDecorator('isPayment')(
                <Select>
                  <Option key="0" value="0">
                    否
                  </Option>
                  <Option key="1" value="1">
                    是
                  </Option>
                </Select>
              )}
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
      signUpExperienceCourse: { list, pagination },
      loading,
    } = this.props;
    const { selectedRows, current, showModalVisible } = this.state;

    return (
      <PageHeaderWrapper title="体验课报名管理">
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