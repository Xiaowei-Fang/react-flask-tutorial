
import React from 'react';
import { Table, Spin, Alert } from 'antd'; 

// 定义表格的列 (保持不变)
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    sorter: (a, b) => a.id - b.id,
  },
  {
    title: '业务部门',
    dataIndex: 'department',
    key: 'department',
    sorter: (a, b) => a.department.localeCompare(b.department),
  },
  {
    title: '季度',
    dataIndex: 'quarter',
    key: 'quarter',
  },
  {
    title: '收入 (亿美元)',
    dataIndex: 'revenue',
    key: 'revenue',
    sorter: (a, b) => a.revenue - b.revenue,
    render: (text) => `$${text}B`,
  },
];

class DataTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      loading: true,
      error: null, // 用于存放错误信息
    };
  }

  async componentDidMount() {
    const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';
    try {
      const response = await fetch(`${API_URL}/api/ms/all-data`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (Array.isArray(data)) {
        const formattedData = data.map(item => ({ ...item, key: item.id }));
        this.setState({ dataSource: formattedData, loading: false });
      } else {
        // 如果返回的不是数组，抛出错误
        throw new Error("从后端获取的数据格式不正确");
      }

    } catch (error) {
      console.error("Failed to fetch table data:", error);
      this.setState({ loading: false, error: error.message });
    }
  }

  render() {
    const { loading, dataSource, error } = this.state;

    if (loading) {
      return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
          <p style={{ marginTop: '10px' }}>正在从数据库加载数据...</p>
        </div>
      );
    }
    
    // 显示错误提示
    if (error) {
      return (
        <Alert
          message="数据加载失败"
          description={`错误详情: ${error}。`}
          type="error"
          showIcon
        />
      );
    }

    return (
      <div>
        <h2>数据库原始数据</h2>
        <Table columns={columns} dataSource={dataSource} pagination={{ pageSize: 5 }} />
        
        <Alert
          message="如何管理数据？"
          description={
            <div>
              <p>想要添加、修改或删除数据，请使用命令行工具。</p>
              <p>1. 打开一个新的终端窗口。</p>
              <p>2. 导航到项目文件夹 (<code>backend/</code>)。</p>
              <p>4. 运行命令，例如flask --app run.py db add 来添加新数据，flask --app run.py db show 来查看所有数据。</p>
              <p>5. 操作完成后刷新本网页。</p>
            </div>
          }
          type="info"
          style={{ marginTop: '20px' }}
          showIcon
        />
      </div>
    );
  }
}

export default DataTable;