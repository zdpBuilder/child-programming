import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      links={[
        {
          key: '首页',
          title: <Icon type="home" />,
          href: 'http://localhost:8000',
          blankTarget: true,
        },
        {
          key: '小童编程屋',
          title: '小童编程屋',
          href: ' http://192.168.11.184:8601/',
          blankTarget: true,
        },
        {
          key: '小童官网',
          title: '小童官网',
          href: 'http://localhost:8083',
          blankTarget: true,
        },
      ]}
      copyright={
        <Fragment>
          Copyright <Icon type="copyright" /> 2019 zdpBuilder
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;
