import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import { Row, Col, Card, List, Avatar } from 'antd';
import EditableLinkGroup from '@/components/EditableLinkGroup';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './Workplace.less';
import globalData from '../../utils/globalData';

const links = [
  {
    title: '贝壳官网',
    href: globalData.bastCodingUrl,
  },
  {
    title: '贝壳编辑器',
    href: globalData.codeSquare,
  },
  {
    title: '贝壳海报网',
    href: globalData.baseCodingPostersUrl,
  },
];

@connect(({ user, project, activities, chart, loading }) => ({
  user,
  project,
  activities,
  chart,
  currentUserLoading: loading.effects['user/fetchCurrent'],
  projectLoading: loading.effects['project/fetchStudentWorkList'],
  activitiesLoading: loading.effects['activities/fetchMaterialList'],
}))
class Workplace extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
    });
    dispatch({
      type: 'project/fetchStudentWorkList',
    });
    dispatch({
      type: 'activities/fetchMaterialList',
    });
    dispatch({
      type: 'chart/fetch',
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/clear',
    });
  }

  renderActivities() {
    const {
      activities: { materialList },
    } = this.props;
    return materialList.map(item => (
      <List.Item key={item.id}>
        <List.Item.Meta
          title={
            <span>
              <a className={styles.username}>{item.originName}</a>
              &nbsp;
            </span>
          }
          description={
            <span className={styles.datetime} title={item.introduction}>
              {item.introduction}
            </span>
          }
        />
      </List.Item>
    ));
  }

  render() {
    const {
      user: { currentUser },
      currentUserLoading,
      project: { list },
      projectLoading,
      activitiesLoading,
    } = this.props;

    const pageHeaderContent =
      currentUser && Object.keys(currentUser).length ? (
        <div className={styles.pageHeaderContent}>
          <div className={styles.avatar}>
            <Avatar size="large" src={globalData.photoBaseUrl + currentUser.photoUrl} />
          </div>
          <div className={styles.content}>
            <div className={styles.contentTitle}>
              欢迎，
              {currentUser.name}
              ，祝你开心每一天！
            </div>
          </div>
        </div>
      ) : null;

    const extraContent = (
      <div className={styles.extraContent}>
        <div className={styles.statItem}>
          <p>项目参与人数</p>
          <p>4</p>
        </div>
        <div className={styles.statItem}>
          <p>项目周期</p>
          <p>
            <span>2019-3/</span>2019-5
          </p>
        </div>
      </div>
    );

    return (
      <PageHeaderWrapper
        loading={currentUserLoading}
        content={pageHeaderContent}
        extraContent={extraContent}
      >
        <Row gutter={24}>
          <Col xl={16} lg={24} md={24} sm={24} xs={24}>
            <Card
              className={styles.projectList}
              style={{ marginBottom: 24 }}
              title="最新推送作品"
              bordered={false}
              loading={projectLoading}
              bodyStyle={{ padding: 0 }}
            >
              {list ? (
                list.map(item => (
                  <Card.Grid className={styles.projectGrid} key={item.id}>
                    <Card bodyStyle={{ padding: 0 }} bordered={false}>
                      <Card.Meta
                        title={
                          <div className={styles.cardTitle}>
                            <Avatar size="small" src={item.coverUrl} />
                            <Link to="#">{item.workName}</Link>
                          </div>
                        }
                        description={item.description}
                      />
                      <div className={styles.projectItemContent}>
                        <Link to="" />
                        {item.studentName && (
                          <span className={styles.datetime} title={item.studentNamee}>
                            {item.studentName}
                          </span>
                        )}
                      </div>
                    </Card>
                  </Card.Grid>
                ))
              ) : (
                <Card.Grid className={styles.projectGrid}>
                  <Card bodyStyle={{ padding: 0 }} bordered={false}>
                    <Card.Meta description="暂无" />
                  </Card>
                </Card.Grid>
              )}
            </Card>
            <Card
              bodyStyle={{ padding: 0 }}
              bordered={false}
              className={styles.activeCard}
              title="最新上传资料"
              loading={activitiesLoading}
            >
              <List loading={activitiesLoading} size="large">
                <div className={styles.activitiesList}>{this.renderActivities()}</div>
              </List>
            </Card>
          </Col>
          <Col xl={8} lg={24} md={24} sm={24} xs={24}>
            <Card
              style={{ marginBottom: 24 }}
              title="快速开始 / 便捷导航"
              bordered={false}
              bodyStyle={{ padding: 0 }}
            >
              <EditableLinkGroup onAdd={() => {}} links={links} />
            </Card>
            {/*    <Card
              style={{ marginBottom: 24 }}
              bordered={false}
              title="XX 指数"
              loading={radarData.length === 0}
            >
              <div className={styles.chart}>
                <Radar hasLegend height={343} data={radarData} />
              </div>
            </Card> */}
            {/*  <Card
              bodyStyle={{ paddingTop: 12, paddingBottom: 12 }}
              bordered={false}
              title="团队"
              loading={projectLoading}
            >
              <div className={styles.members}>
                <Row gutter={48}>
                  {notice.map(item => (
                    <Col span={12} key={`members-item-${item.id}`}>
                      <Link to={item.href}>
                        <Avatar src={item.logo} size="small" />
                        <span className={styles.member}>{item.member}</span>
                      </Link>
                    </Col>
                  ))}
                </Row>
              </div>
            </Card> */}
          </Col>
        </Row>
      </PageHeaderWrapper>
    );
  }
}

export default Workplace;
