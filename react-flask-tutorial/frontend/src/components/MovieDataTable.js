// frontend/src/components/MovieDataTable.js
import React from 'react';
import { Table, Spin, Alert } from 'antd';
import axios from 'axios';

// 定义表格的列，现在对应电影数据
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    sorter: (a, b) => a.id - b.id,
  },
  {
    title: '电影标题',
    dataIndex: 'title',
    key: 'title',
    sorter: (a, b) => a.title.localeCompare(b.title),
  },
  {
    title: '国家/地区',
    dataIndex: 'country',
    key: 'country',
  },
  {
    title: '类型',
    dataIndex: 'genre',
    key: 'genre',
  },
];

class MovieDataTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      loading: true,
      error: null,
    };
  }

  async componentDidMount() {
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';
      // 使用 axios 发送 GET 请求
      const response = await axios.get(`${API_URL}/api/movies/all-data`);

      const data = response.data;

      if (Array.isArray(data)) {
        // AntD Table 需要每条记录都有一个唯一的 'key' 属性
        // 我们直接使用电影的 'id' 作为 key
        const formattedData = data.map(item => ({ ...item, key: item.id }));
        this.setState({ dataSource: formattedData, loading: false });
      } else {
        throw new Error("获取的数据格式不正确。");
      }

    } catch (error) {
      console.error("加载表格数据失败:", error);
      const errorMsg = error.response?.data?.msg || error.message || "未知错误";
      this.setState({ loading: false, error: errorMsg });
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

    if (error) {
      return <Alert message="数据加载失败" description={error} type="error" showIcon />;
    }

    return (
      <div>
        <h2>豆瓣电影Top100 - 原始数据</h2>
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={{ pageSize: 10, showSizeChanger: true }} // 每页10条，允许改变每页数量
          scroll={{ x: 'max-content' }} // 如果列太多，允许水平滚动
        />
      </div>
    );
  }
}

export default MovieDataTable;