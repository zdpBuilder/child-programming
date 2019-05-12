import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Form, List } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './CardList.less';

import Ellipsis from '@/components/Ellipsis';

/* eslint react/no-multi-comp:0 */
@connect(({ suggestion, loading }) => ({
  suggestion,
  loading: loading.models.suggestion,
}))
@Form.create()
class TableList extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'suggestion/fetchList',
    });
  }

  render() {
    const {
      suggestion: { list, pagination },
      loading,
    } = this.props;
    console.log(pagination);
    return (
      <PageHeaderWrapper title="意见反馈">
        <div className={styles.cardList}>
          <List
            rowKey="id"
            loading={loading}
            pagination={pagination}
            grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
            dataSource={list}
            renderItem={item => (
              <List.Item key={item.id}>
                <Card hoverable className={styles.card}>
                  <Card.Meta
                    title={moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')}
                    description={
                      <Ellipsis className={styles.item} lines={3}>
                        {item.commentText}
                      </Ellipsis>
                    }
                  />
                </Card>
              </List.Item>
            )}
          />
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default TableList;
