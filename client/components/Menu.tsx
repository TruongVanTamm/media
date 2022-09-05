import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu } from 'antd';
import Link from 'next/link';
import React, { useState } from 'react';

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('Strapi Dashboard', '1', <PieChartOutlined />),
  getItem(<Link href="metadata">MetaData</Link>, '9'),
  getItem('Content Manager', '2', <DesktopOutlined />),
  getItem('Plugin', 'sub1', <UserOutlined />, [
    getItem('Content-Type Builder', '3'),
    getItem(<Link href="media">Media Library</Link>, '8'),
  ]),
  getItem('General', 'sub2', <TeamOutlined />, [
    getItem('Plugin', '4'),
    getItem('Market', '5'),
  ]),
  getItem('Setting', '6', <FileOutlined />),
  getItem(<Link href="login">Login</Link>, '7'),
];

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="logo" />
        <Menu
          theme="dark"
          defaultSelectedKeys={['1']}
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout className="site-layout">
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb
            style={{
              margin: '16px 0',
            }}
          >
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb>
          <div
            className="site-layout-background"
            style={{
              padding: 24,
              minHeight: 360,
              fontSize: '20px',
              color: 'black',
            }}
          >
            Welcome to Strapi
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          A product of Truong Van Tam
        </Footer>
      </Layout>
    </Layout>
  );
};

export default App;
