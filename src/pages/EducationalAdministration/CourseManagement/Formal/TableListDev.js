import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Button, Modal, message, Divider, InputNumber } from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import DescriptionList from '@/components/DescriptionList';

import styles from '@/layouts/TableList.less';

import globalData from '@/utils/globalData';
import UpLoadPicExample from '@/components/UpLoad/UpLoadPicExample';
import regExp from '@/utils/regExp';
import NestTableForm from './NestTableForm';

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
      title="校区查看"
      visible={showModalVisible}
      onCancel={() => handleShowModalVisible()}
      cancelText="关闭"
      footer={null}
    >
      <Card bordered={false}>
        <DescriptionList size="small" col={1} style={{ marginLeft: 0 }}>
          <Description term="校区名称">{current.name}</Description>
          <Description term="地&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;址">
            {current.address}
          </Description>
          <Description term="负&nbsp;&nbsp;责&nbsp;&nbsp;人">{current.chargeUserName}</Description>
          <Description term="联系电话">{current.chargeUserPhone}</Description>
          <Description term="校区描述">{current.introduction}</Description>
        </DescriptionList>
      </Card>
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
    gradeSelectData,
  } = props;
  const {
    form: { getFieldDecorator },
  } = props;

  // 处理参数
  // 未校验课时数量
  const handleFormData = fieldsValue => {
    // 处理时间安排
    const { timeSchedule } = fieldsValue;
    const timeScheduleArray = [];
    timeSchedule.forEach(value => {
      const data = {
        ...value,
        gradeId: value.gradeId.key,
      };
      const { key, editable, ...otherValues } = data;
      timeScheduleArray.push(otherValues);
    });

    const formValues = {
      ...fieldsValue,
      timeSchedule: timeScheduleArray,
      photoUrl: '',
      periodCount: parseInt(fieldsValue.periodCount, 10),
      maxCapacity: parseInt(fieldsValue.maxCapacity, 10),
    };
    console.log(JSON.stringify(formValues));
    return formValues;
  };

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // 处理参数
      const formData = handleFormData(fieldsValue);
      // form.resetFields();
      handleAddAndEdit(formData);
    });
  };

  return (
    <Modal
      destroyOnClose
      width={618}
      title={`课程${current.id ? '编辑' : '添加'}`}
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
        {getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入课程名称！', max: 50 }],
          initialValue: current.name,
        })(<Input placeholder="请输入课程名称" />)}
      </FormItem>
      <FormItem label="课程编码" {...formLayout}>
        {getFieldDecorator('code', {
          rules: [{ required: true, message: '请输入课程编码！', max: 50 }],
          initialValue: current.code,
        })(<Input placeholder="请输入课程编码" />)}
      </FormItem>
      <FormItem label="价格" {...formLayout}>
        {getFieldDecorator('money', {
          rules: [{ required: true, message: '请输入价格！' }],
          initialValue: current.money,
        })(<InputNumber style={{ width: 255 }} min={0} placeholder="请输入价格" />)}
      </FormItem>
      <FormItem label="课时数量" {...formLayout}>
        {getFieldDecorator('periodCount', {
          rules: [
            {
              required: true,
              message: '请输入课时数量,不得超过十位！',
              pattern: regExp.positiveIntegerPattern,
            },
          ],
          initialValue: current.periodCount,
        })(<Input placeholder="请输入课时数量" />)}
      </FormItem>
      <FormItem label="联系电话" {...formLayout}>
        {getFieldDecorator('telephone', {
          rules: [{ required: true, message: '请输入联系电话！', max: 50 }],
          initialValue: current.telephone,
        })(<Input placeholder="请输入联系电话" />)}
      </FormItem>
      <FormItem label="简介" {...formLayout}>
        {getFieldDecorator('introduction', {
          rules: [{ required: true, message: '请输入至少五个字符的简介！', min: 5, max: 500 }],
          initialValue: current.introduction,
        })(<TextArea rows={4} placeholder="请输入至少五个字符" />)}
      </FormItem>
      <FormItem label="图片介绍" {...formLayout}>
        <UpLoadPicExample
          props={props}
          formFieldPropsKey="photoUrl"
          defaultImgUrl={current.photoUrl}
          fileUpLoadDirectoryName={globalData.fileUpLoadDirectoryName.course}
        />
      </FormItem>
      <Card title="时间安排" bordered={false}>
        {getFieldDecorator('timeSchedule', {
          rules: [{ required: true }],
          initialValue: current.tableData,
        })(<NestTableForm gradeSelectData={gradeSelectData} />)}
      </Card>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ course, loading }) => ({
  course,
  loading: loading.models.course,
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
      dataIndex: 'name',
    },
    {
      title: '编码',
      dataIndex: 'code',
    },
    {
      title: '价格',
      dataIndex: 'money',
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
          <a onClick={() => this.deletecourse(record.id)}>删除</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'course/fetchList',
    });
  }

  // 处理表格分页
  handleStandardTableChange = pagination => {
    const { dispatch } = this.props;

    dispatch({
      type: 'course/save',
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
      type: 'course/fetchList',
      payload: {},
    });
  };

  // 删除多行
  handleDeleteRows = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    if (!selectedRows) return;
    dispatch({
      type: 'course/remove',
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
        type: 'course/fetchList',
        payload: values,
      });
    });
  };

  // 添加弹出框
  handleAddModalVisible = flag => {
    if (flag) {
      this.fetchGradeData();
    }
    this.setState({
      modalVisible: !!flag,
      current: undefined,
    });
  };

  //  编辑弹出框
  handleEditModalVisible = (flag, item) => {
    if (flag) {
      this.fetchGradeData();
    }
    this.setState({
      modalVisible: !!flag,
      current: item,
    });
  };

  // 班级信息
  fetchGradeData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'course/fetchGradeInfoList',
    });
  };

  // 添加、编辑处理
  handleAddAndEdit = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'course/addAndUpdate',
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
  deletecourse = id => {
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
      type: 'course/remove',
      payload: {
        idsStr,
      },
      callback: response => {
        this.handleDeleteResultData(response);
      },
    });
  };

  // 添加、编辑返回结果处理
  handleResultData = response => {
    const { dispatch } = this.props;
    if (globalData.successCode === response.status) {
      dispatch({
        type: 'course/fetchList',
      });
      message.success(response.msg);
      this.handleAddModalVisible();
    } else message.error(response.msg);
  };

  // 删除返回结果处理
  handleDeleteResultData = response => {
    if (globalData.successCode === response.status) {
      const { dispatch } = this.props;
      dispatch({
        type: 'course/fetchList',
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
              <div key={item.classroomCode}>
                {`编号${item.classroomCode}教室占用校区${item.courseName}`}
              </div>
            ))}
          </div>
        ),
      });
    }
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
            <FormItem label="校区名称">
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
      course: { list, pagination, gradeSelectData },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, current, showModalVisible } = this.state;

    const parentMethods = {
      handleAddAndEdit: this.handleAddAndEdit,
      handleAddModalVisible: this.handleAddModalVisible,
    };

    return (
      <PageHeaderWrapper title="正式课管理">
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
          gradeSelectData={gradeSelectData}
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
