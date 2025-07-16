// frontend/src/pages/Dashboard.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChartOutlined, PieChartOutlined, TableOutlined, LogoutOutlined } from '@ant-design/icons';
import { Layout, Menu, Button } from 'antd';
import '../App.css'; // 沿用旧的样式

// 组件重命名
import BarChart from '../components/MovieBarChart';
import PieChart from '../components/MoviePieChart';
import DataTable from '../components/MovieDataTable';

const { Header, Content, Sider } = Layout;

// 菜单项也更新一下
const menuItems = [
  { key: '1', icon: <AreaChartOutlined />, label: '按国家看电影数量' },
  { key: '2', icon: <PieChartOutlined />, label: '按类型看电影数量' },
  { key: '3', icon: <TableOutlined />, label: 'Top 100 原始数据' },
];

const Dashboard = ({ onLogout }) => {
  const [selectedKey, setSelectedKey] = useState('1');
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
  };

  const renderContent = () => {
    switch (selectedKey) {
      case '1': return <BarChart />;
      case '2': return <PieChart />;
      case '3': return <DataTable />;
      default: return <BarChart />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={[selectedKey]}
          mode="inline"
          items={menuItems}
          onClick={(e) => setSelectedKey(e.key)}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: '0 16px', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>豆瓣电影Top100数据分析</h2>
          <Button icon={<LogoutOutlined />} onClick={handleLogoutClick}>
            退出登录
          </Button>
        </Header>
        <Content style={{ margin: '16px' }}>
          <div style={{ padding: 24, minHeight: 360, background: '#fff', borderRadius: '8px' }}>
            {renderContent()}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;