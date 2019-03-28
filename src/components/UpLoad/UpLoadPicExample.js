/* eslint-disable react/destructuring-assignment,react/require-default-props */
import React from 'react';
import { Modal, Upload, Icon, Input, message } from 'antd';
import PropTypes from 'prop-types';
import globalData from '@/utils/globalData';

/**
 * @Description 图片上传组件
 * @Author zdp
 */
class UpLoadPicExample extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [],
  };

  componentWillMount() {
    if (
      typeof this.props.defaultImgUrl !== 'undefined' &&
      this.props.defaultImgUrl !== null &&
      this.props.defaultImgUrl !== ''
    ) {
      this.setState({
        fileList: [
          {
            uid: '-1',
            name: 'xxx.png',
            status: 'done',
            url: this.props.defaultImgUrl,
            response: this.props.defaultImgUrl,
          },
        ],
      });
    }
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleChange = ({ fileList }) => this.setState({ fileList });

  beforeUpload = file => {
    const isJPG = file.type === 'image/jpeg';
    if (!isJPG) {
      message.error('只允许上传JPG');
    }
    const isLt2M = file.size / 1024 / 1024 < globalData.UPLOAD_IMG.MAX_SIZE;
    if (!isLt2M) {
      message.error('图片大小不能超过2MB');
    }
    return isJPG && isLt2M;
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const {
      form: { getFieldDecorator },
    } = this.props.props;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传图片</div>
      </div>
    );
    return (
      <div className="clearfix">
        {getFieldDecorator(this.props.formFieldPropsKey, {
          initialValue: this.state.fileList.length > 0 ? this.state.fileList[0].response : [],
        })(<Input type="hidden" />)}

        <Upload
          action={globalData.UPLOAD_IMG.URL + this.props.fileUpLoadDirectoryName}
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          beforeUpload={this.beforeUpload}
        >
          {fileList.length > 0 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

UpLoadPicExample.propTypes = {
  defaultImgUrl: PropTypes.string, // 初始化的值
  props: PropTypes.object.isRequired, // 表单属性
  formFieldPropsKey: PropTypes.string.isRequired, // 序列化名称 相当于<input /> 标签中的name
  fileUpLoadDirectoryName: PropTypes.string.isRequired, // 文件上传目录
};
export default UpLoadPicExample;
