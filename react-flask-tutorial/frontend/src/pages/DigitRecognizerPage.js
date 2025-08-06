// frontend/src/pages/DigitRecognizerPage.js
import React, { useState } from 'react';
import { Upload, message, Button, Spin, Card, Row, Col, Typography, Progress, Alert } from 'antd';
import { InboxOutlined, BarChartOutlined, DeleteOutlined, CloudUploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Dragger } = Upload;
const { Title, Text } = Typography;

const DigitRecognizerPage = () => {
    const [file, setFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';

    const handleRemove = () => {
        setFile(null);
        setPreviewImage(null);
        setResult(null);
    };

    const draggerProps = {
        name: 'image',
        multiple: false,
        showUploadList: false, // 关键：不让 Dragger 自己显示文件列表
        beforeUpload: (file) => {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
                message.error('你只能上传 JPG/PNG 格式的图片!');
                return Upload.LIST_IGNORE;
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                message.error('图片必须小于 2MB!');
                return Upload.LIST_IGNORE;
            }
            
            setFile(file);
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => setPreviewImage(reader.result);
            setResult(null);
            
            return false; // 始终返回 false，我们手动控制上传
        },
        onRemove: handleRemove,
    };

    const handlePredict = async () => {
        if (!file) {
            message.warning('请先选择一张图片!');
            return;
        }

        const formData = new FormData();
        formData.append('image', file);
        setLoading(true);

        try {
            const response = await axios.post(`${API_URL}/api/ml/predict-digit`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setResult(response.data);
            message.success('识别成功!');
        } catch (error) {
            message.error(error.response?.data?.error || '识别失败，请检查后端服务或图片格式。');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card title="手写数字识别器">
            <Row gutter={24}>
                {/* --- 左侧上传/预览区域 --- */}
                <Col xs={24} md={12}>
                    {/* --- 关键修改：条件渲染 --- */}
                    {!previewImage ? (
                        // 1. 如果没有图片预览，显示 Dragger
                        <Dragger {...draggerProps} height={220}>
                            <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                            <p className="ant-upload-text">点击或拖拽图片到此区域</p>
                            <p className="ant-upload-hint">请上传一张包含单个手写数字的图片(JPG/PNG 格式)。</p>
                        </Dragger>
                    ) : (
                        // 2. 如果有图片预览，显示图片和替换按钮
                        <Card
                            cover={<img alt="preview" src={previewImage} style={{ padding: '20px', maxHeight: '220px', objectFit: 'contain' }} />}
                            actions={[
                                <Button key="replace" icon={<DeleteOutlined />} type="primary" danger onClick={handleRemove}>
                                    移除
                                </Button>
                            ]}
                        >
                            <Card.Meta title="图片已准备就绪" description="请点击“开始识别”按钮进行预测。" />
                        </Card>
                    )}
                    
                    <Button
                        type="primary"
                        icon={<CloudUploadOutlined />}
                        onClick={handlePredict}
                        loading={loading}
                        style={{ marginTop: '20px', width: '100%' }}
                        disabled={!file}
                    >
                        开始识别
                    </Button>
                </Col>

                {/* --- 右侧结果展示区域 --- */}
                <Col xs={24} md={12} style={{marginTop: '20px'}}>
                    <Card title={<><BarChartOutlined /> 识别结果</>} style={{height: '100%'}}>
                        {loading && <div style={{textAlign: 'center', padding: '50px'}}><Spin tip="正在玩命计算中..." size="large"/></div>}
                        
                        {!loading && result && result.prediction !== undefined && (
                            <div>
                                <Title level={2} style={{ textAlign: 'center', color: '#1677ff' }}>
                                    模型预测结果是: {result.prediction}
                                </Title>
                                <Text strong>置信度分布:</Text>
                                {Object.entries(result.confidences)
                                    .sort(([, a], [, b]) => b - a)
                                    .map(([digit, confidence]) => (
                                    <div key={digit}>
                                        <Text>数字 {digit}:</Text>
                                        <Progress percent={parseFloat((confidence * 100).toFixed(2))} />
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        {!loading && (!result || result.prediction === undefined) && (
                            <div style={{textAlign: 'center', color: '#aaa', paddingTop: '50px'}}>
                                <p>上传图片并点击“开始识别”后，</p>
                                <p>结果将在这里显示。</p>
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>
        </Card>
    );
};

export default DigitRecognizerPage;