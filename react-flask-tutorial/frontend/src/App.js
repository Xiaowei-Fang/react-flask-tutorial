// frontend/src/App.js
import React from 'react';
// 导入图标和组件
import { AreaChartOutlined, PieChartOutlined, TableOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import './App.css';

import DepartmentRevenueChart from './components/DepartmentRevenueChart';
import QuarterlyRevenueChart from './components/QuarterlyRevenueChart';
import DataTable from './components/DataTable'; 

const { Header, Content, Sider } = Layout;

// 在菜单项中添加新的一项
const menuItems = [
  {
    key: '1',
    icon: <AreaChartOutlined />,
    label: '总收入分布',
  },
  {
    key: '2',
    icon: <PieChartOutlined />,
    label: '季度收入分布',
  },
  { 
    key: '3',
    icon: <TableOutlined />,
    label: '原始数据表格',
  },
];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedKey: '1',
    };
  }

  handleMenuClick = (e) => {
    this.setState({ selectedKey: e.key });
  };

  renderContent = () => {
    switch (this.state.selectedKey) {
      case '1':
        return <DepartmentRevenueChart />;
      case '2':
        return <QuarterlyRevenueChart />;
      // 在 switch 中添加新的 case
      case '3': 
        return <DataTable />;
      default:
        return <DepartmentRevenueChart />;
    }
  };
  
  render() {
    const colorBgContainer = '#ffffff'; 

    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible>
          <div className="demo-logo-vertical" />
          <Menu
            theme="dark"
            defaultSelectedKeys={[this.state.selectedKey]}
            mode="inline"
            items={menuItems}
            onClick={this.handleMenuClick}
          />
        </Sider>
        <Layout>
          <Header style={{ padding: '0 16px', background: colorBgContainer }}>
            <h2>微软业务收入</h2>
          </Header>
          <Content style={{ margin: '16px' }}>
            <div
              style={{
                padding: 24,
                minHeight: 360,
                background: colorBgContainer,
                borderRadius: '8px',
              }}
            >
              {this.renderContent()}
            </div>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default App;