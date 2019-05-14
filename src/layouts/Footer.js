import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';
import globalData from '../utils/globalData';

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
          key: '小童在线编程屋',
          title: '小童在线编程屋',
          href: globalData.codeSquare,
          blankTarget: true,
        },
        {
          key: '小童官网',
          title: '小童官网',
          href: globalData.Url,
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
