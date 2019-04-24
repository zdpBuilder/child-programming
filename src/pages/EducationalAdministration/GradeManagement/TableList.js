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
  Cascader,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import DescriptionList from '@/components/DescriptionList';

import styles from '@/layouts/TableList.less';
import globalData from '@/utils/globalData';
import regExp from '@/utils/regExp';

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
      title="班级查看"
      visible={showModalVisible}
      onCancel={() => handleShowModalVisible()}
      cancelText="关闭"
      footer={null}
    >
      <DescriptionList size="small" style={{ marginBottom: 32, marginLeft: 50 }} col={1}>
        <Description term="校区名称">{current.schoolName}</Description>
        <Description term="教室编号">{current.classroomCode}</Description>
        <Description term="课程名称">{current.courseName}</Description>
        <Description term="老师名称">{current.teacherName}</Description>
        <Description term="班级名称">{current.name}</Description>
        <Description term="最大容量">{current.maxCapacity}</Description>
        <Description term="备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注">
          {current.description}
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
    initGradeInfo,
  } = props;
  const {
    form: { getFieldDecorator },
  } = props;
  const { classroomDetailInfoList = [], teacherInfoList = [] } = initGradeInfo;
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
      title={`班级${current.id ? '编辑' : '添加'}`}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleAddModalVisible()}
    >
      <FormItem>
        {getFieldDecorator('id', {
          initialValue: current.id,
        })(<Input type="hidden" />)}
      </FormItem>
      <FormItem label="老师" {...formLayout}>
        {getFieldDecorator('teacherId', {
          rules: [{ required: true, message: '请选择老师！' }],
          initialValue: current.teacherId || '',
        })(
          <Select placeholder="请选择老师" style={{ width: 255 }}>
            {teacherInfoList.map(item => (
              <Option key={item.value} value={item.value}>
                {item.label}
              </Option>
            ))}
          </Select>
        )}
      </FormItem>
      <FormItem label="校区教室" {...formLayout}>
        {getFieldDecorator('classroomId', {
          rules: [{ required: true, message: '请选择校区教室！' }],
          initialValue: current.schoolAndClassroomId || [],
        })(
          <Cascader
            placeholder="请选择校区教室"
            options={classroomDetailInfoList}
            style={{ width: 255 }}
          />
        )}
      </FormItem>
      <FormItem label="班级名称" {...formLayout}>
        {getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入班级名称，不得超过50！', max: 50 }],
          initialValue: current.name,
        })(<Input placeholder="请输入班级名称" />)}
      </FormItem>
      <FormItem label="最大容量" {...formLayout}>
        {getFieldDecorator('maxCapacity', {
          rules: [
            {
              required: true,
              message: '请输入最大容量,不得超过十位！',
              pattern: regExp.positiveIntegerPattern,
            },
          ],
          initialValue: current.maxCapacity,
        })(<Input placeholder="请输入最大容量" />)}
      </FormItem>
      <FormItem label="描述" {...formLayout}>
        {getFieldDecorator('description', {
          rules: [{ message: '请输入至少五个字符的备注！', min: 5, max: 500 }],
          initialValue: current.description,
        })(<TextArea rows={4} placeholder="请输入至少五个字符" />)}
      </FormItem>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ grade, loading }) => ({
  grade,
  loading: loading.models.grade,
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
      dataIndex: 'classroomCode',
    },
    {
      title: '班级名称',
      dataIndex: 'name',
    },
    {
      title: '课程名称',
      dataIndex: 'courseName',
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
      type: 'grade/fetchList',
    });
  }

  // 处理表格分页
  handleStandardTableChange = pagination => {
    const { dispatch } = this.props;

    dispatch({
      type: 'grade/save',
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
      type: 'grade/fetchList',
      payload: {},
    });
  };

  // 删除多行
  handleDeleteRows = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    if (!selectedRows) return;
    dispatch({
      type: 'grade/remove',
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
        type: 'grade/fetchList',
        payload: values,
      });
    });
  };

  // 添加弹出框
  handleAddModalVisible = flag => {
    this.handleInitData(flag);
    this.setState({
      modalVisible: !!flag,
      current: undefined,
    });
  };

  //  编辑弹出框
  handleEditModalVisible = (flag, item) => {
    if (item.courseId) {
      message.warning(`${item.courseName}正占用，无法编辑!请先将本班在课程中移除`);
      return;
    }
    this.handleInitData(flag);
    this.setState({
      modalVisible: !!flag,
      current: item,
    });
  };

  // 新增、编辑时请求初始化数据
  handleInitData = flag => {
    if (flag) {
      const { dispatch } = this.props;
      // 初始化新增、编辑页面信息
      dispatch({
        type: 'grade/init',
      });
    }
  };

  // 添加、编辑处理
  handleAddAndEdit = fields => {
    const { dispatch } = this.props;
    this.handleFormField(fields);
    dispatch({
      type: 'grade/addAndUpdate',
      payload: {
        ...fields,
      },
      callback: response => {
        this.handleResultData(response);
      },
    });
  };

  // 处理表单数据
  handleFormField = fields => {
    const formData = fields;
    const { classroomId } = fields;
    ({ 1: formData.classroomId } = classroomId);
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
      title: '删除班级',
      content: '确定删除该班级吗？',
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
      type: 'grade/remove',
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
        type: 'grade/fetchList',
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
            <FormItem label="班级名称">
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
      grade: { list, pagination, initGradeInfo },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, current, showModalVisible } = this.state;

    const parentMethods = {
      handleAddAndEdit: this.handleAddAndEdit,
      handleAddModalVisible: this.handleAddModalVisible,
    };

    return (
      <PageHeaderWrapper title="班级管理">
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
          initGradeInfo={initGradeInfo}
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
