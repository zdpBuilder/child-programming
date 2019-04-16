/* eslint-disable react/destructuring-assignment,react/require-default-props,object-shorthand,prefer-destructuring,react/no-unused-state,react/jsx-indent */
import React from 'react';
import { Icon, Input, message, Upload } from 'antd';
import PropTypes from 'prop-types';
import globalData from '@/utils/globalData';

/**
 * @Description 文件上传组件
 * @Author zdp
 */
class UploadFileExample extends React.Component {
  state = {
    fileList: [],
  };

  onChange = info => {
    const status = info.file.status;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      if (info.fileList[0].response.status === '200' || info.fileList[0].response.status === 200) {
        message.success('上传成功');
        this.setState({ fileList: info.fileList });
      } else {
        this.setState({ fileList: [] });
        message.error(info.fileList[0].response.msg);
      }
    } else if (status === 'error') {
      this.setState({ fileList: [] });
      message.error(`${info.file.name} 上传失败.`);
    }
  };

  componentWillMount() {
    if (this.props.defaultFile) {
      this.setState({
        fileList: [
          {
            uid: '-1',
            name: this.props.defaultFile.name,
            status: 'done',
            url: globalData.photoBaseUrl + this.props.defaultFile.url,
            response: {
              status: 200,
              msg: this.props.defaultImgUrl,
            },
          },
        ],
      });
    }
  }

  render() {
    const Dragger = Upload.Dragger;
    const props = {
      name: 'file',
      multiple: false,
      defaultFileList: this.state.fileList,
      action: globalData.upLoadImgSetting.url + this.props.fileUpLoadDirectoryName,
      accept: globalData.upLoadFileSetting.type,
    };

    const {
      form: { getFieldDecorator },
    } = this.props.props;

    return (
      <div>
        {typeof this.props.formFieldPropsKey[0] !== 'undefined' ? (
          <div>
            {getFieldDecorator(this.props.formFieldPropsKey[0], {
              initialValue: this.state.fileList.length > 0 ? this.state.fileList[0].name : [],
            })(<Input type="hidden" />)}
          </div>
        ) : (
          <div />
        )}
        {getFieldDecorator(this.props.formFieldPropsKey[1], {
          initialValue: this.state.fileList.length > 0 ? this.state.fileList[0].response.msg : [],
        })(<Input type="hidden" />)}

        <Dragger
          {...props}
          onChange={this.onChange}
          defaultFileList={this.state.fileList}
          disabled={this.state.fileList.length > 0}
          showUploadList={this.state.fileList.length > 0}
          onRemove={() => this.setState({ fileList: [] })}
        >
          <p className="ant-upload-drag-icon">
            <Icon type="inbox" />
          </p>
          <p className="ant-upload-text">点击或者拖拽进行上传</p>
          <p className="ant-upload-hint">仅支持单个文件上传</p>
        </Dragger>
      </div>
    );
  }
}

UploadFileExample.propTypes = {
  defaultFile: PropTypes.object, // 初始化的值
  props: PropTypes.object.isRequired, // 表单属性
  formFieldPropsKey: PropTypes.array.isRequired, // 序列化名称 相当于<input /> 标签中的name
  fileUpLoadDirectoryName: PropTypes.string.isRequired, // 文件上传目录
};
export default UploadFileExample;
