// src/pages/RegisterPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Input, Button, Card, message } from 'antd';

const RegisterPage = () => {
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';

    const onFinish = async (values) => {
        if (values.password !== values.confirm) {
            message.error('两次输入的密码不一致!');
            return;
        }
        try {
            await axios.post(`${API_URL}/api/auth/register`, {
                username: values.username,
                password: values.password,
            });
            message.success('注册成功，请登录!');
            navigate('/login');
        } catch (error) {
            message.error(error.response?.data?.msg || '注册失败');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Card title="注册" style={{ width: 400 }}>
                <Form name="register" onFinish={onFinish}>
                    <Form.Item name="username" rules={[{ required: true, message: '请输入用户名!' }]}>
                        <Input placeholder="用户名" />
                    </Form.Item>
                    <Form.Item name="password" rules={[{ required: true, message: '请输入密码!' }]}>
                        <Input.Password placeholder="密码" />
                    </Form.Item>
                    <Form.Item name="confirm" dependencies={['password']} rules={[{ required: true, message: '请确认密码!' }]}>
                        <Input.Password placeholder="确认密码" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>注册</Button>
                    </Form.Item>
                    <Button type="link" onClick={() => navigate('/login')}>
                        已有账号？去登录
                    </Button>
                </Form>
            </Card>
        </div>
    );
};

export default RegisterPage;