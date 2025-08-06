import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Input, Button, Card, message } from 'antd';

const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';

  const onFinish = async (values) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, values);
      const token = response.data.access_token;
      onLogin(token); // 调用父组件的登录处理函数
      message.success('登录成功!');
      navigate('/dashboard'); // 跳转到仪表盘
    } catch (error) {
      message.error(error.response?.data?.msg || '登录失败');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card title="登录" style={{ width: 400 }}>
        <Form name="login" onFinish={onFinish}>
          <Form.Item name="username" rules={[{ required: true, message: '请输入用户名!' }]}>
            <Input placeholder="用户名" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请输入密码!' }]}>
            <Input.Password placeholder="密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              登录
            </Button>
          </Form.Item>
          <Button type="link" onClick={() => navigate('/register')}>
            还没有账号？去注册
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;