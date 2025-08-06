// frontend/src/pages/Dashboard.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// --- 关键修改在这里 ---
// 把 EditOutlined 添加到下面这行 import 语句中
import { AreaChartOutlined, PieChartOutlined, TableOutlined, LogoutOutlined, EditOutlined } from '@ant-design/icons';
import { Layout, Menu, Button } from 'antd';
import '../App.css'; 

import BarChart from '../components/MovieBarChart';
import PieChart from '../components/MoviePieChart';
import DataTable from '../components/MovieDataTable';
import DigitRecognizerPage from './DigitRecognizerPage';

const { Header, Content, Sider } = Layout;

const menuItems = [
  { key: '1', icon: <AreaChartOutlined />, label: '按国家看电影数量' },
  { key: '2', icon: <PieChartOutlined />, label: '按类型看电影数量' },
  { key: '3', icon: <TableOutlined />, label: 'Top 100 原始数据' },
  { key: '4', icon: <EditOutlined />, label: '手写数字识别' },
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
      case '4': return <DigitRecognizerPage />;
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
          <h2>数据分析与可视化平台</h2>
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