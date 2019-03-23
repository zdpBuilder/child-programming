import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Row, Col, Form, Card, Select, List, Button, Icon } from 'antd';

import TagSelect from '@/components/TagSelect';
import Ellipsis from '@/components/Ellipsis';
import StandardFormRow from '@/components/StandardFormRow';

import styles from './Projects.less';

const { Option } = Select;
const FormItem = Form.Item;

/* eslint react/no-array-index-key: 0 */

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
class CoverCardList extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'list/fetch',
      payload: {
        count: 8,
      },
    });
  }

  render() {
    const {
      list: { list },
      loading,
      form,
    } = this.props;
    const { getFieldDecorator } = form;

    const cardList = (
      <List
        rowKey="id"
        loading={loading}
        grid={{ gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }}
        dataSource={['', ...list]}
        renderItem={item =>
          item ? (
            <List.Item>
              <Card
                className={styles.card}
                hoverable
                cover={<img alt={item.title} src={item.cover} />}
                actions={[<a>编辑</a>, <a>删除</a>]}
              >
                <Card.Meta
                  title={<a>{item.title}</a>}
                  description={<Ellipsis lines={2}>{item.subDescription}</Ellipsis>}
                />
                <div className={styles.cardItemContent}>
                  <span>{moment(item.updatedAt).fromNow()}</span>
                  <div className={styles.avatarList} />
                </div>
              </Card>
            </List.Item>
          ) : (
            <List.Item>
              <Button type="dashed" className={styles.newButton}>
                <Icon type="plus" /> 新增作品
              </Button>
            </List.Item>
          )
        }
      />
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
            <StandardFormRow title="所属类目" block style={{ paddingBottom: 11 }}>
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
            </StandardFormRow>
            <StandardFormRow title="其它选项" grid last>
              <Row gutter={16}>
                <Col lg={8} md={10} sm={10} xs={24}>
                  <FormItem {...formItemLayout} label="作者">
                    {getFieldDecorator('author', {})(
                      <Select placeholder="不限" style={{ maxWidth: 200, width: '100%' }}>
                        <Option value="lisa">张戴鹏</Option>
                        <Option value="lisa">杨帆</Option>
                        <Option value="lisa">赵赞峰</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col lg={8} md={10} sm={10} xs={24}>
                  <FormItem {...formItemLayout} label="好评度">
                    {getFieldDecorator('rate', {})(
                      <Select placeholder="不限" style={{ maxWidth: 200, width: '100%' }}>
                        <Option value="good">优秀</Option>
                        <Option value="normal">普通</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
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
