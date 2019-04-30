import React, { Component } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Form, Input, Button, message } from 'antd';
import { connect } from 'dva';
import styles from './BaseView.less';
import UpLoadPicExample from '../../../components/UpLoad/UpLoadPicExample';
import globalData from '../../../utils/globalData';

const FormItem = Form.Item;

// 头像组件 方便以后独立，增加裁剪之类的功能
/*
const AvatarView = ({ avatar }) => (
  <Fragment>
    <div className={styles.avatar_title}>
      <FormattedMessage id="app.settings.basic.avatar" defaultMessage="Avatar" />
    </div>
    <div className={styles.avatar}>
      <img src={avatar} alt="avatar" />
    </div>
    <Upload fileList={[]}>
      <div className={styles.button_view}>
        <Button icon="upload">
          <FormattedMessage id="app.settings.basic.change-avatar" defaultMessage="Change avatar" />
        </Button>
      </div>
    </Upload>
  </Fragment>
);
*/

const validatorPhone = (rule, value, callback) => {
  const values = value.split('-');
  if (!values[0]) {
    callback('Please input your area code!');
  }
  if (!values[1]) {
    callback('Please input your phone number!');
  }
  callback();
};

@connect(({ user }) => ({
  currentUser: user.currentUser,
}))
@Form.create()
class BaseView extends Component {
  componentDidMount() {
    // this.setBaseInfo();
  }

  // setBaseInfo = () => {
  //   const { currentUser, form } = this.props;
  //   Object.keys(form.getFieldsValue()).forEach(key => {
  //     const obj = {};
  //     obj[key] = currentUser[key] || null;
  //     form.setFieldsValue(obj);
  //   });
  // };

  getAvatarURL() {
    const { currentUser } = this.props;
    if (currentUser.photoUrl) {
      return currentUser.photoUrl;
    }
    const url = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
    return url;
  }

  getViewDom = ref => {
    this.view = ref;
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      dispatch({
        type: 'user/fetch',
        payload: fieldsValue,
        callback: response => {
          message.success(response.msg);
          dispatch({
            type: 'user/fetchCurrent',
          });
        },
      });
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      currentUser,
    } = this.props;
    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <div className={styles.left}>
          <Form layout="vertical" onSubmit={this.handleSubmit} hideRequiredMark>
            <FormItem style={{ display: 'none' }}>
              {getFieldDecorator('id', {
                initialValue: currentUser.id,
              })(<Input type="hidden" />)}
            </FormItem>
            <FormItem label="登录账号">
              {getFieldDecorator('loginId', {
                initialValue: currentUser.loginId,
              })(<Input disabled />)}
            </FormItem>
            <FormItem label="当前角色">
              {getFieldDecorator('roleName', {
                initialValue: currentUser.roleName,
              })(<Input disabled />)}
            </FormItem>
            <FormItem label="姓名">
              {getFieldDecorator('name', {
                initialValue: currentUser.name,
                rules: [
                  {
                    required: true,
                    message: '请输入姓名！',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label="个人简介">
              {getFieldDecorator('introduction', {
                initialValue: currentUser.introduction,
                rules: [
                  {
                    required: true,
                    message: '请输入个人介绍！',
                  },
                ],
              })(<Input.TextArea placeholder="个人介绍" rows={4} />)}
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.settings.basic.phone' })}>
              {getFieldDecorator('phone', {
                initialValue: currentUser.phone,
                rules: [
                  {
                    required: true,
                    message: '请输入电话！',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <Button htmlType="submit">
              <FormattedMessage
                id="app.settings.basic.update"
                defaultMessage="Update Information"
              />
            </Button>
          </Form>
        </div>
        <div className={styles.right}>
          <FormItem label="照片">
            <UpLoadPicExample
              props={this.props}
              formFieldPropsKey="photoUrl"
              defaultImgUrl={currentUser.photoUrl}
              fileUpLoadDirectoryName={globalData.fileUpLoadDirectoryName.teacher}
            />
          </FormItem>
        </div>
      </div>
    );
  }
}

export default BaseView;
