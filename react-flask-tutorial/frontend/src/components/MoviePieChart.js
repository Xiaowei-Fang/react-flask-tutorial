// frontend/src/components/MoviePieChart.js
import React from 'react';
import ReactECharts from 'echarts-for-react';
import axios from 'axios';
import { Spin, Alert } from 'antd';

class MoviePieChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            option: {},
            loading: true,
            error: null,
        };
    }

    async componentDidMount() {
        try {
            const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';
            // 使用 axios 发送 GET 请求
            const response = await axios.get(`${API_URL}/api/movies/count-by-genre`);
            
            const data = response.data;

            if (data && Array.isArray(data)) {
                const newOption = {
                    title: {
                        text: '电影类型数量Top10',
                        left: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{b} : {c}部 ({d}%)' // 自定义提示信息
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: data.map(item => item.name) // 从数据动态生成图例
                    },
                    series: [
                        {
                            name: '电影类型',
                            type: 'pie',
                            radius: '60%', // 饼图半径
                            center: ['50%', '60%'], // 饼图位置
                            data: data, // 后端返回的数据格式正好适用
                            emphasis: {
                                itemStyle: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                };
                this.setState({ option: newOption, loading: false });
            } else {
                throw new Error("获取的数据格式不正确。");
            }
        } catch (error) {
            console.error("加载饼图数据失败:", error);
            const errorMsg = error.response?.data?.msg || error.message || "未知错误";
            this.setState({ loading: false, error: errorMsg });
        }
    }

    render() {
        const { loading, option, error } = this.state;

        if (loading) {
            return (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <Spin size="large" />
                </div>
            );
        }

        if (error) {
            return <Alert message="数据加载失败" description={error} type="error" showIcon />;
        }

        return <ReactECharts option={option} style={{ height: '500px', width: '100%' }} />;
    }
}

export default MoviePieChart;