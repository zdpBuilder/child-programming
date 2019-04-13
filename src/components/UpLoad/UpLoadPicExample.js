/* eslint-disable react/destructuring-assignment,react/require-default-props,object-shorthand,array-callback-return,no-empty */
import React from 'react';
import { Icon, Input, message, Modal, Upload } from 'antd';
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
    if (this.props.defaultImgUrl) {
      this.setState({
        fileList: [
          {
            uid: '-1',
            name: '',
            status: 'done',
            url: globalData.photoBaseUrl + this.props.defaultImgUrl,
            response: {
              status: 200,
              msg: this.props.defaultImgUrl,
            },
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
    // 提示信息
    if (fileList.length > 0 && fileList[0].status === 'done') {
      if (fileList[0].response.status === '0' || fileList[0].response.status === 0) {
        message.error(fileList[0].response.msg);
        this.setState({ fileList: [] });
      }
    } else if (fileList.length > 0 && fileList[0].status === 'error') {
      message.error('上传失败');
      this.setState({ fileList: [] });
    }

    return (
      <div className="clearfix">
        {getFieldDecorator(this.props.formFieldPropsKey, {
          initialValue:
            this.state.fileList.length > 0 && this.state.fileList[0].status === 'done'
              ? this.state.fileList[0].response.msg
              : [],
        })(<Input type="hidden" />)}

        <Upload
          action={globalData.upLoadImgSetting.url + this.props.fileUpLoadDirectoryName}
          listType="picture-card"
          fileList={fileList}
          accept={globalData.upLoadImgSetting.type}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
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
