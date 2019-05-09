/* eslint-disable react/jsx-indent */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Button, Calendar, Select, Badge, Modal, Input } from 'antd';

import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import moment from 'moment';

import styles from '@/layouts/TableList.less';

const FormItem = Form.Item;
const { Option } = Select;

const dateFormat = 'YYYY-MM-DD';
const timeFormat = 'HH:mm:ss';

// 课程表展示
const ShowscheduleCalendarModal = props => {
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
    if (currentScheduleList.length > 0) {
      currentScheduleList.forEach(item => {
        switch (item.isSignIn) {
          case 1:
            listData.push({ type: 'success', content: `课时${item.period}已签` });
            break;
          case 0:
            listData.push({ type: 'warning', content: `课时${item.period}未签` });
            break;
          default:
        }
      });
    }
    return listData || [];
  };

  // 日期渲染
  const dateCellRender = value => {
    const listData = getListData(value);
    return (
      <ul>
        {listData.map(item => (
          <li key={item.content}>
            <Badge status={item.type} text={item.content} />
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
      title={`${current.studentName}课程表`}
      visible={scheduleCalendarModalVisible}
      onCancel={() => handleScheduleCalendarModalVisible(false)}
      footer={null}
    >
      <Calendar dateCellRender={dateCellRender} onSelect={handleDateSelect} />
    </Modal>
  );
};

/* eslint react/no-multi-comp:0 */
@connect(({ studentCourseSchedule, loading }) => ({
  studentCourseSchedule,
  loading: loading.models.studentCourseSchedule,
}))
@Form.create()
class ScheduleCalendar extends PureComponent {
  state = {
    scheduleCalendarModalVisible: false,
    selectedRows: [],
    current: {},
  };

  columns = [
    {
      title: '学生姓名',
      dataIndex: 'studentName',
    },
    {
      title: '班级名称',
      dataIndex: 'gradeName',
    },
    {
      title: '课程名称',
      dataIndex: 'courseName',
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleScheduleCalendarModalVisible(true, record)}>查看课程表</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'studentCourseSchedule/fetchGradeInfoList',
    });

    dispatch({
      type: 'studentCourseSchedule/fetchList',
    });
  }

  // 查看学生课表
  handleScheduleCalendarModalVisible = (flag, record) => {
    // 如果flag为true，则请求该学生课表数据
    if (flag) {
      const { dispatch } = this.props;
      dispatch({
        type: 'studentCourseSchedule/fetchCourseScheduleList',
        payload: {
          studentId: record.studentId,
          courseId: record.courseId,
        },
      });
    }

    this.setState({
      scheduleCalendarModalVisible: !!flag,
      current: record,
    });
  };

  // 搜索条件重置
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({});
    dispatch({
      type: 'studentCourseSchedule/fetchList',
      payload: {},
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
        type: 'studentCourseSchedule/fetchList',
        payload: values,
      });
    });
  };

  // 处理表格分页
  handleStandardTableChange = pagination => {
    const { dispatch } = this.props;

    dispatch({
      type: 'studentCourseSchedule/save',
      payload: {
        pagination,
      },
    });
  };

  // 搜索
  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      studentCourseSchedule: { gradeSelectData = [] },
    } = this.props;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="班级">
              {getFieldDecorator('gradeId')(
                <Select placeholder="请选择班级">
                  {gradeSelectData.map(item => (
                    <Option key={item.value} value={item.value}>
                      {item.label}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="学生姓名">
              {getFieldDecorator('studentName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>

          <Col md={6} sm={24}>
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
      studentCourseSchedule: { studentInfoList, pagination, courseSchduleList },
      loading,
    } = this.props;

    const { scheduleCalendarModalVisible, selectedRows, current } = this.state;

    return (
      <PageHeaderWrapper title="学生课程表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <StandardTable
              rowKey="studentId"
              selectedRows={selectedRows}
              loading={loading}
              data={studentInfoList}
              columns={this.columns}
              paginationData={pagination}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        {courseSchduleList.length > 0 && (
          <ShowscheduleCalendarModal
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

export default ScheduleCalendar;
