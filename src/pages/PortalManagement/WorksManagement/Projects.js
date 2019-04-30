/* eslint-disable react/no-unused-state,no-param-reassign */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Card, List, Button, Icon, Input, Modal, message, Divider } from 'antd';
import Ellipsis from '@/components/Ellipsis';
import StandardFormRow from '@/components/StandardFormRow';
import DescriptionList from '@/components/DescriptionList';

import styles from './Projects.less';
import globalData from '../../../utils/globalData';
import UploadFileExample from '../../../components/UpLoad/UploadFileExample';

const FormItem = Form.Item;
const { Description } = DescriptionList;
const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};
/* eslint react/no-array-index-key: 0 */

const ShowViewModal = props => {
  const {
    cancelPushstudentWork,
    pushstudentWork,
    showModalVisible,
    handleShowModalVisible,
    current = {},
  } = props;

  return (
    <Modal
      destroyOnClose
      title="作品信息查看"
      visible={showModalVisible}
      onCancel={() => handleShowModalVisible()}
      cancelText="关闭"
      footer={null}
    >
      <Card bordered={false}>
        <DescriptionList title="作品基本信息" size="small" col={3} style={{ marginLeft: 0 }}>
          <Description term="作品名称">{current.workName}</Description>
          <Description term="阅读次数">{current.pageView}</Description>
          <Description term="收藏数量">{current.collectionNumber}</Description>
          <Description term="点赞数量">{current.likeCount}</Description>
          <Description term="是否推送">
            {current.status === 2 ? (
              <a onClick={() => cancelPushstudentWork(current)}>取消推送</a>
            ) : (
              <a onClick={() => pushstudentWork(current)}>推送</a>
            )}
          </Description>
        </DescriptionList>
        <Divider />

        <DescriptionList title="作品其他信息" size="small" col={2}>
          <Description term="作品描述">{current.description}</Description>
          <Description term="作品演示">
            <a rel="noopener noreferrer" target="_blank" href={globalData.scratchPlayerUrl}>
              {current.workName}
            </a>
          </Description>
        </DescriptionList>
      </Card>
    </Modal>
  );
};

const CreateForm = Form.create()(props => {
  const { modalVisible, handleAddAndEdit, form, handleAddModalVisible, current = {} } = props;
  const {
    form: { getFieldDecorator },
  } = props;

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      form.resetFields();
      handleAddAndEdit(fieldsValue);
    });
  };

  return (
    <Modal
      okText="确定"
      cancelText="取消"
      destroyOnClose
      title={`作品${current.id ? '编辑' : '添加'}`}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleAddModalVisible()}
    >
      <FormItem>
        {getFieldDecorator('id', {
          initialValue: current.id,
        })(<Input type="hidden" />)}
      </FormItem>
      <FormItem label="作品名称" {...formLayout}>
        {getFieldDecorator('workName', {
          rules: [{ required: true, message: '请输入作品名称！', max: 50 }],
          initialValue: current.workName,
        })(<Input placeholder="请输入作品名称" />)}
      </FormItem>
      <FormItem label="作品上传" {...formLayout}>
        <UploadFileExample
          props={props}
          formFieldPropsKey={[undefined, 'workUrl']}
          fileUpLoadDirectoryName={globalData.fileUpLoadDirectoryName.studentWork}
          defaultFile={{ name: current.workName, url: current.workUrl }}
        />
      </FormItem>
      <FormItem label="作品描述" {...formLayout}>
        {getFieldDecorator('description', {
          rules: [{ required: true, message: '请输入作品描述！', max: 50 }],
          initialValue: current.description,
        })(<Input rows={4} placeholder="请输入请输入作品描述" />)}
      </FormItem>
    </Modal>
  );
});
@connect(({ studentWork, loading }) => ({
  studentWork,
  loading: loading.models.studentWork,
}))
@Form.create({
  onValuesChange({ dispatch }, changedValues, allValues) {
    // 表单项变化时请求数据
    // eslint-disable-next-line
    console.log(changedValues, allValues);

    dispatch({
      type: 'studentWork/fetchList',
      payload: allValues,
    });
  },
})
class CoverCardList extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: [],
    current: {},
    showModalVisible: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'studentWork/fetchList',
    });
  }

  //  查看弹出框
  handleShowModalVisible = (flag, item) => {
    this.setState({
      showModalVisible: !!flag,
      current: item,
    });
  };

  // 添加弹出框
  handleAddModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      current: undefined,
    });
  };

  // 删除单个提示
  deletestudentWork = id => {
    Modal.confirm({
      title: '删除资料类别',
      content: '确定删除该作品吗？',
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
      type: 'studentWork/remove',
      payload: {
        idsStr,
      },
      callback: response => {
        this.handleResultData(response);
      },
    });
  };

  // 推送作品提示
  pushstudentWork = item => {
    item.status = 2;
    Modal.confirm({
      title: '推送作品',
      content: '确定推送该作品为优秀作品吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.handlePushItem(item),
    });
  };

  // 取消推送作品提示
  cancelPushstudentWork = item => {
    item.status = 1;
    Modal.confirm({
      title: '推送作品',
      content: '确定取消推送该作品吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.handlePushItem(item),
    });
  };

  handlePushItem = item => {
    const { dispatch } = this.props;
    dispatch({
      type: 'studentWork/addAndUpdate',
      payload: {
        ...item,
      },
      callback: response => {
        this.handleResultData(response);
      },
    });
  };

  //  编辑弹出框
  handleEditModalVisible = (flag, item) => {
    this.setState({
      modalVisible: !!flag,
      current: item,
    });
  };

  // 添加、编辑处理
  handleAddAndEdit = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'studentWork/addAndUpdate',
      payload: {
        ...fields,
      },
      callback: response => {
        this.handleResultData(response);
      },
    });
  };

  // 添加、编辑、删除返回结果处理
  handleResultData = response => {
    console.log(response);
    const { dispatch } = this.props;
    if (globalData.successCode === response.status) {
      dispatch({
        type: 'studentWork/fetchList',
      });
      message.success(response.msg);
      this.handleAddModalVisible();
    } else message.error(response.msg);
  };

  render() {
    const {
      studentWork: { list },
      loading,
      form,
    } = this.props;
    const { getFieldDecorator } = form;
    const { modalVisible, showModalVisible, current } = this.state;

    const parentMethods = {
      handleAddAndEdit: this.handleAddAndEdit,
      handleAddModalVisible: this.handleAddModalVisible,
    };
    const showParentMethods = {
      cancelPushstudentWork: this.cancelPushstudentWork,
      pushstudentWork: this.pushstudentWork,
    };
    const cardList = (
      <List
        rowKey="id"
        loading={loading}
        grid={{ gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }}
        dataSource={[...list]}
        renderItem={item =>
          list ? (
            <List.Item>
              <Card
                className={styles.card}
                hoverable
                cover={<img alt={item.workName} src={globalData.workDefaultBgUrl} />}
                actions={[
                  item.status === 2 ? (
                    <a onClick={() => this.cancelPushstudentWork(item)}>取消推送</a>
                  ) : (
                    <a onClick={() => this.pushstudentWork(item)}>推送</a>
                  ),
                  <a href={globalData.photoBaseUrl + item.workUrl} download={item.workName}>
                    下载
                  </a>,
                  <a onClick={() => this.handleShowModalVisible(true, item)}>查看</a>,
                  <a onClick={() => this.deletestudentWork(item.id)}>删除</a>,
                ]}
              >
                <Card.Meta
                  title={<a>{item.workName}</a>}
                  description={<Ellipsis lines={2}>{item.description}</Ellipsis>}
                />
                <div className={styles.cardItemContent}>
                  {/* <span>{moment(item.updatedAt).fromNow()}</span> */}
                  <div className={styles.avatarList} />
                </div>
              </Card>
            </List.Item>
          ) : (
            <List.Item>
              <Button type="dashed" className={styles.newButton}>
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                暂无作品
              </Button>
            </List.Item>
          )
        }
      >
        <CreateForm {...parentMethods} modalVisible={modalVisible} current={current} />
        <ShowViewModal
          {...showParentMethods}
          showModalVisible={showModalVisible}
          current={current}
          handleShowModalVisible={this.handleShowModalVisible}
        />
      </List>
    );

    const formItemLayout = {
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    return (
      <div className={styles.coverCardList}>
        <Card bordered={false}>
          <Form layout="inline">
            {/* <StandardFormRow title="所属类目" block style={{ paddingBottom: 11 }}>
              <FormItem>
                {getFieldDecorator('category')(
                  <TagSelect expandable>
                    <TagSelect.Option value="cat1">编程一</TagSelect.Option>
                    <TagSelect.Option value="cat2">编程二</TagSelect.Option>
                    <TagSelect.Option value="cat3">编程三</TagSelect.Option>
                    <TagSelect.Option value="cat4">编程四</TagSelect.Option>
                    <TagSelect.Option value="cat5">编程五</TagSelect.Option>
                    <TagSelect.Option value="cat6">编程六</TagSelect.Option>
                    <TagSelect.Option value="cat7">编程七</TagSelect.Option>
                    <TagSelect.Option value="cat8">编程八</TagSelect.Option>
                    <TagSelect.Option value="cat9">编程九</TagSelect.Option>
                    <TagSelect.Option value="cat10">编程十</TagSelect.Option>
                    <TagSelect.Option value="cat11">编程十一</TagSelect.Option>
                    <TagSelect.Option value="cat12">编程十二</TagSelect.Option>
                  </TagSelect>
                )}
              </FormItem>
            </StandardFormRow> */}
            <StandardFormRow title="搜索条件" grid last>
              <Row gutter={16}>
                <Col lg={8} md={10} sm={10} xs={24}>
                  <FormItem {...formItemLayout} label="作品名称">
                    {getFieldDecorator('name')(
                      <Input onFocus={this.onValueChange} placeholder="请输入" />
                    )}
                  </FormItem>
                </Col>
                {/* <Col lg={8} md={10} sm={10} xs={24}>
                  <FormItem {...formItemLayout} label="好评度">
                    {getFieldDecorator('rate', {})(
                      <Select placeholder="不限" style={{ maxWidth: 200, width: '100%' }}>
                        <Option value="good">优秀</Option>
                        <Option value="normal">普通</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col> */}
              </Row>
            </StandardFormRow>
          </Form>
        </Card>
        <div className={styles.cardList}>{cardList}</div>
      </div>
    );
  }
}

export default CoverCardList;
