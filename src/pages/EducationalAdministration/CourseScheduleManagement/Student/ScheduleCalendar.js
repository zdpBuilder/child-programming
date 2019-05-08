import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Button, Calendar, Select, Badge, Modal } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from '@/layouts/TableList.less';

const FormItem = Form.Item;
const { Option } = Select;

/* eslint react/no-multi-comp:0 */
@connect(({ studentSchedule, loading }) => ({
  studentSchedule,
  loading: loading.models.studentSchedule,
}))
@Form.create()
class ScheduleCalendar extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'studentSchedule/fetchGradeInfoList',
    });
  }

  // 搜索条件重置
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({});
    dispatch({
      type: 'studentSchedule/fetchList',
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
        type: 'studentSchedule/fetchList',
        payload: values,
      });
    });
  };

  getListData = value => {
    let listData;
    switch (value.date()) {
      case 8:
        listData = [{ type: 'success', content: '已签' }];
        break;
      case 10:
        listData = [{ type: 'warning', content: '未签' }];
        break;
      case 15:
        listData = [{ type: 'warning', content: '未签' }];
        break;
      default:
    }
    return listData || [];
  };

  // 日期渲染
  dateCellRender = value => {
    const listData = this.getListData(value);
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
  handleDateSelect = value => {
    console.log(value.format('YYYY-MM-DD'));
    Modal.info({
      title: '课程安排',
      okText: '关闭',
      content: (
        <div>
          <div key={1}>Java A班 8:00-10:00 Java</div>
        </div>
      ),
    });
  };

  // 搜索
  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      studentSchedule: { gradeSelectData = [] },
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
            <FormItem label="学生">
              {getFieldDecorator('studentId')(
                <Select placeholder="请选择学生">
                  <Option key={1} value={1}>
                    张三
                  </Option>
                  <Option key={2} value={2}>
                    李四
                  </Option>
                </Select>
              )}
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
    return (
      <PageHeaderWrapper title="学生课程表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <Calendar dateCellRender={this.dateCellRender} onSelect={this.handleDateSelect} />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ScheduleCalendar;
