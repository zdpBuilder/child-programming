/* eslint-disable react/jsx-curly-brace-presence */
import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Button, Card, Col, Divider, Form, Input, message, Modal, Row } from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import DescriptionList from '@/components/DescriptionList';

import styles from '@/layouts/TableList.less';
import globalData from '@/utils/globalData';
import TreeExample from './TreeExample';

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
      title="角色信息查看"
      visible={showModalVisible}
      onCancel={() => handleShowModalVisible()}
      cancelText="关闭"
      footer={null}
    >
      <Card bordered={false}>
        <DescriptionList title="角色基本信息" size="small" col={1} style={{ marginLeft: 0 }}>
          <Description term="角色名称">{current.name}</Description>
          <Description term="角色Token">{current.roleToken}</Description>
          <Description term="角色备注">{current.comment}</Description>
        </DescriptionList>
      </Card>
    </Modal>
  );
};

const AssignAuthorityForm = Form.create()(props => {
  const {
    AssignAuthorityViewVisible,
    form,
    handleAssignAuthorityViewVisibleVisible,
    AssignAuthority,
    current = {},
    menuData = [],
    treeCheckDefaultIds,
  } = props;

  const {
    form: { getFieldDecorator },
  } = props;

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      console.info(fieldsValue);
      AssignAuthority(fieldsValue);
    });
  };

  return (
    <Modal
      destroyOnClose
      title="角色分配权限"
      visible={AssignAuthorityViewVisible}
      onCancel={() => handleAssignAuthorityViewVisibleVisible()}
      cancelText="取消"
      okText={'授权'}
      onOk={okHandle}
    >
      <Card
        bordered={false}
        title={
          <div style={{ textAlign: 'center' }}>
            {' '}
            当前角色
            <Divider type="vertical" />
            {current.name}
          </div>
        }
      >
        <FormItem>
          {getFieldDecorator('roleToken', {
            initialValue: current.roleToken,
          })(<Input type="hidden" />)}
        </FormItem>
        <FormItem label="角色授权" {...formLayout}>
          <TreeExample
            props={props}
            formFieldPropsKey={'menuIds'}
            treeData={menuData}
            defaultAuthority={treeCheckDefaultIds || null}
          />
        </FormItem>
      </Card>
    </Modal>
  );
});

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
      title={`角色${current.id ? '编辑' : '添加'}`}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleAddModalVisible()}
    >
      <FormItem>
        {getFieldDecorator('id', {
          initialValue: current.id,
        })(<Input type="hidden" />)}
      </FormItem>
      <FormItem label="角色名称" {...formLayout}>
        {getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入角色名称！', max: 50 }],
          initialValue: current.name,
        })(<Input placeholder="请输入角色名称" />)}
      </FormItem>
      <FormItem label="角色Token" {...formLayout}>
        {getFieldDecorator('roleToken', {
          rules: [{ required: true, message: '请输入角色Token！', max: 50 }],
          initialValue: current.roleToken,
        })(<Input placeholder="请输入角色Token" />)}
      </FormItem>
      <FormItem label="角色备注" {...formLayout}>
        {getFieldDecorator('comment', {
          rules: [{ required: true, message: '请输入角色备注！', max: 50 }],
          initialValue: current.comment,
        })(<Input rows={4} placeholder="请输入角色备注" />)}
      </FormItem>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ role, loading }) => ({
  role,
  loading: loading.models.role,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: [],
    current: {},
    showModalVisible: false,
    AssignAuthorityViewVisible: false,
    treeCheckDefaultIds: [],
  };

  columns = [
    {
      title: '角色名称',
      dataIndex: 'name',
    },
    {
      title: '角色Token',
      dataIndex: 'roleToken',
    },
    {
      title: '角色备注',
      dataIndex: 'comment',
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
          <a onClick={() => this.deleterole(record.id)}>删除</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleAssignAuthorityViewVisibleVisible(true, record)}>权限分配</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/fetchList',
    });
    dispatch({
      type: 'role/getMenuData',
    });
  }

  // 处理表格分页
  handleStandardTableChange = pagination => {
    const { dispatch } = this.props;

    dispatch({
      type: 'role/save',
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
      type: 'role/fetchList',
      payload: {},
    });
  };

  // 删除多行
  handleDeleteRows = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    if (!selectedRows) return;
    dispatch({
      type: 'role/remove',
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
        type: 'role/fetchList',
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

  // 授权处理
  AssignAuthority = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/assignAuthority',
      payload: {
        ...fields,
      },
      callback: response => {
        if (globalData.successCode === response.status) {
          dispatch({
            type: 'role/fetchList',
          });
          message.success(response.msg);
          this.handleAssignAuthorityViewVisibleVisible();
        } else message.error(response.msg);
      },
    });
  };

  // 添加、编辑处理
  handleAddAndEdit = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/addAndUpdate',
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

  handleAssignAuthorityViewVisibleVisible = (flag, item) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/getMenuData',
    });
    if (flag) {
      dispatch({
        type: 'role/treeCheckDefaultIds',
        payload: {
          roleToken: item.roleToken,
        },
        callback: response => {
          this.setState({
            AssignAuthorityViewVisible: !!flag,
            current: item,
            treeCheckDefaultIds: response.data.menuIds,
          });
        },
      });
    } else {
      this.setState({
        AssignAuthorityViewVisible: !!flag,
        current: item,
      });
    }
  };

  // 删除单个提示
  deleterole = id => {
    Modal.confirm({
      title: '删除角色',
      content: '确定删除该角色吗？',
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
      type: 'role/remove',
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
        type: 'role/fetchList',
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
            <FormItem label="角色名称">
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
      role: { list, pagination, menuData },
      loading,
    } = this.props;
    console.log(loading);
    const {
      selectedRows,
      modalVisible,
      current,
      showModalVisible,
      AssignAuthorityViewVisible,
      treeCheckDefaultIds,
    } = this.state;

    const parentMethods = {
      handleAddAndEdit: this.handleAddAndEdit,
      handleAddModalVisible: this.handleAddModalVisible,
    };

    return (
      <PageHeaderWrapper title="角色管理">
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
        <AssignAuthorityForm
          AssignAuthority={this.AssignAuthority}
          AssignAuthorityViewVisible={AssignAuthorityViewVisible}
          current={current}
          treeCheckDefaultIds={treeCheckDefaultIds}
          menuData={menuData}
          handleAssignAuthorityViewVisibleVisible={this.handleAssignAuthorityViewVisibleVisible}
        />
      </PageHeaderWrapper>
    );
  }
}

export default TableList;
