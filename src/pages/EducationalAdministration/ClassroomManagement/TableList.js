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
  InputNumber,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import DescriptionList from '@/components/DescriptionList';

import styles from '@/layouts/TableList.less';
import globalData from '@/utils/globalData';

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
      title="教室查看"
      visible={showModalVisible}
      onCancel={() => handleShowModalVisible()}
      cancelText="关闭"
      footer={null}
    >
      <DescriptionList size="small" style={{ marginBottom: 32, marginLeft: 50 }} col={1}>
        <Description term="校区名称">{current.schoolName}</Description>
        <Description term="教室编号">{current.code}</Description>
        <Description term="最大容量">{current.maxCapacity}</Description>
        <Description term="备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注">
          {current.comment}
        </Description>
      </DescriptionList>
    </Modal>
  );
};

const CreateForm = Form.create()(props => {
  const {
    modalVisible,
    handleAddAndEdit,
    form,
    handleAddModalVisible,
    current = {},
    schoolSelectData,
  } = props;
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
      title={`教室${current.id ? '编辑' : '添加'}`}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleAddModalVisible()}
    >
      <FormItem>
        {getFieldDecorator('id', {
          initialValue: current.id,
        })(<Input type="hidden" />)}
      </FormItem>
      <FormItem label="校区名称" {...formLayout}>
        {getFieldDecorator('schoolId', {
          rules: [{ required: true, message: '请选择校区！' }],
          initialValue: current.schoolId ? `${current.schoolId}` : '',
        })(
          <Select placeholder="请选择校区名称" style={{ width: 255 }}>
            {schoolSelectData.map(item => (
              <Option key={item.value}>{item.label}</Option>
            ))}
          </Select>
        )}
      </FormItem>
      <FormItem label="教室编号" {...formLayout}>
        {getFieldDecorator('code', {
          rules: [{ required: true, type: 'number', message: '请输入三位数字教室编号！' }],
          initialValue: current.code,
        })(
          <InputNumber
            style={{ width: 255 }}
            min={100}
            max={999}
            placeholder="请输入三位数字教室编号"
          />
        )}
      </FormItem>
      <FormItem label="最大容量" {...formLayout}>
        {getFieldDecorator('maxCapacity', {
          rules: [
            { required: true, type: 'number', message: '请输入最大容量,不得超过1000！', max: 50 },
          ],
          initialValue: current.maxCapacity,
        })(<InputNumber style={{ width: 255 }} min={0} max={1000} placeholder="请输入最大容量" />)}
      </FormItem>
      <FormItem label="备注" {...formLayout}>
        {getFieldDecorator('comment', {
          rules: [{ message: '请输入至少五个字符的备注！', min: 5, max: 500 }],
          initialValue: current.comment,
        })(<TextArea rows={4} placeholder="请输入至少五个字符" />)}
      </FormItem>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ classroom, loading }) => ({
  classroom,
  loading: loading.models.classroom,
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
      title: '校区名称',
      dataIndex: 'schoolName',
    },
    {
      title: '教室编码',
      dataIndex: 'code',
    },
    {
      title: '最大容量',
      dataIndex: 'maxCapacity',
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
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'classroom/fetchList',
    });
    dispatch({
      type: 'classroom/fetchSchoolInfoList',
    });
  }

  // 处理表格分页
  handleStandardTableChange = pagination => {
    const { dispatch } = this.props;

    dispatch({
      type: 'classroom/save',
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
      type: 'classroom/fetchList',
      payload: {},
    });
  };

  // 删除多行
  handleDeleteRows = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    if (!selectedRows) return;
    dispatch({
      type: 'classroom/remove',
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
        type: 'classroom/fetchList',
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
      type: 'classroom/addAndUpdate',
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
      type: 'classroom/remove',
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
    const { dispatch } = this.props;
    if (globalData.successCode === response.status) {
      dispatch({
        type: 'classroom/fetchList',
      });
      message.success(response.msg);
      this.handleAddModalVisible();
    } else message.error(response.msg);
  };

  // 搜索
  renderSimpleForm(schoolSelectData) {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="校区名称">
              {getFieldDecorator('schoolId')(
                <Select placeholder="请选择校区名称" style={{ width: 150 }}>
                  {schoolSelectData.map(item => (
                    <Option key={item.value}>{item.label}</Option>
                  ))}
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
      classroom: { list, pagination, schoolSelectData },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, current, showModalVisible } = this.state;

    const parentMethods = {
      handleAddAndEdit: this.handleAddAndEdit,
      handleAddModalVisible: this.handleAddModalVisible,
    };

    return (
      <PageHeaderWrapper title="教室管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm(schoolSelectData)}</div>
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
          schoolSelectData={schoolSelectData}
        />
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
