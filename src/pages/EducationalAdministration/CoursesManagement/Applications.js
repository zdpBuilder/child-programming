import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Card, Avatar, List, Modal, Input, Table } from 'antd';

import StandardFormRow from '@/components/StandardFormRow';

import styles from './Applications.less';

const FormItem = Form.Item;

@connect(({ list, loading }) => ({
  list,
  loading: loading.models.list,
}))
@Form.create({
  onValuesChange({ dispatch }, changedValues, allValues) {
    // 表单项变化时请求数据
    // eslint-disable-next-line
    console.log(changedValues, allValues);
    // 模拟查询表单生效
    dispatch({
      type: 'list/fetch',
      payload: {
        count: 8,
      },
    });
  },
})
class FilterCardList extends PureComponent {
  state = { visible: false, done: false };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'list/fetch',
      payload: {
        count: 8,
      },
    });
  }

  showModal = () => {
    this.setState({
      visible: true,
      current: undefined,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { current } = this.state;
    const id = current ? current.id : '';

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        done: true,
      });
      dispatch({
        type: 'list/submit',
        payload: { id, ...fieldsValue },
      });
    });
  };

  render() {
    const {
      list: { list },
      loading,
      form,
    } = this.props;
    const { getFieldDecorator } = form;
    const { visible, done } = this.state;
    const modalFooter = done
      ? { footer: null, onCancel: this.handleDone }
      : { okText: '保存', onOk: this.handleSubmit, onCancel: this.handleCancel };
    /* const CardInfo = ({ activeUser, newUser }) => (
      <div className={styles.cardInfo}>
        <div>
          <p>已签到次数</p>
          <p>{activeUser}</p>
        </div>
        <div>
          <p>未签到次数</p>
          <p>{newUser}</p>
        </div>
      </div>
    );
*/
    const formItemLayout = {
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    const columns = [
      {
        title: '时间/日期',
        dataIndex: 'time',
        render: text => <span style={{ color: '#0000ff' }}>{text}</span>,
      },
      {
        title: '星期一',
        dataIndex: 'time1',
      },
      {
        title: '星期二',
        className: 'column-money',
        dataIndex: 'time2',
      },
      {
        title: '星期三',
        dataIndex: 'time3',
      },
      {
        title: '星期四',
        dataIndex: 'time4',
      },
      {
        title: '星期五',
        dataIndex: 'time5',
      },
      {
        title: '星期六',
        dataIndex: 'time6',
      },
      {
        title: '星期日',
        dataIndex: 'time7',
      },
    ];

    const data = [
      {
        key: '1',
        time1: '数学',
        time2: '语文',
        time3: '英语',
        time: '08:00-09:00',
      },
      {
        key: '2',
        time4: '数学',
        time5: '语文',
        time6: '英语',
        time: '10:00-11:00',
      },
      {
        key: '3',
        time1: '数学',
        time2: '语文',
        time3: '英语',
        time: '14:00-15:00',
      },
      {
        key: '3',
        time4: '数学',
        time5: '语文',
        time6: '英语',
        time: '17:00-18:00',
      },
    ];

    return (
      <div className={styles.filterCardList}>
        <Card bordered={false}>
          <Form layout="inline">
            <StandardFormRow title="选项" grid last>
              <Row gutter={16}>
                <Col lg={8} md={10} sm={10} xs={24}>
                  <FormItem {...formItemLayout} label="教师姓名">
                    {getFieldDecorator('author', {})(
                      <Input.Search
                        className={styles.extraContentSearch}
                        placeholder="请输入"
                        onSearch={() => ({})}
                      />
                    )}
                  </FormItem>
                </Col>
              </Row>
            </StandardFormRow>
          </Form>
        </Card>
        <List
          rowKey="id"
          style={{ marginTop: 24 }}
          grid={{ gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }}
          loading={loading}
          dataSource={list}
          renderItem={item => (
            <List.Item key={item.id}>
              <a onClick={this.showModal}>
                <Card hoverable bodyStyle={{ paddingBottom: 20 }}>
                  <Card.Meta avatar={<Avatar size="small" src={item.avatar} />} title="姓名" />
                </Card>
              </a>
            </List.Item>
          )}
        />

        <Modal
          title="课程表"
          className={styles.standardListForm}
          width={800}
          visible={visible}
          {...modalFooter}
        >
          <Table columns={columns} dataSource={data} bordered pagination={false} />
        </Modal>
      </div>
    );
  }
}

export default FilterCardList;
