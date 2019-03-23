import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Calendar, Alert, Card, Modal, LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';

// moment.locale("zh-cn");
@connect(({ list, loading }) => ({
  list,
  loading: loading.models.list,
}))
class SearchList extends Component {
  state = {
    value: moment(),
    messageStatus: false,
    // message: '不可调课',
  };

  componentDidMount() {}

  onSelect = value => {
    let messageStatus = false;

    if (value.format('YYYY-MM-DD') === '2019-01-01') {
      messageStatus = true;
      Modal.confirm({
        title: '确认调课吗？',
        content: '',
        onOk() {
          return new Promise((resolve, reject) => {
            setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
          }).catch(() => console.log('Oops errors!'));
        },
        onCancel() {},
      });
    } else {
      messageStatus = false;
    }
    this.setState({
      value,
      messageStatus,
    });
  };

  onPanelChange = value => {
    this.setState({ value });
  };

  render() {
    const { value, messageStatus } = this.state;

    return (
      <Fragment>
        <Card
          style={{ marginTop: 24 }}
          bordered={false}
          bodyStyle={{ padding: '8px 32px 32px 32px' }}
        >
          {messageStatus ? (
            <Alert message="可以调课" type="success" showIcon />
          ) : (
            <Alert message="不可调课" type="error" showIcon />
          )}
          <LocaleProvider locale={zhCN}>
            <Calendar value={value} onSelect={this.onSelect} onPanelChange={this.onPanelChange} />
          </LocaleProvider>
        </Card>
      </Fragment>
    );
  }
}

export default SearchList;
