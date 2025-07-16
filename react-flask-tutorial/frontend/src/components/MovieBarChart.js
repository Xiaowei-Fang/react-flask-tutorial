import React from 'react';
import ReactECharts from 'echarts-for-react';
import axios from 'axios';

class MovieBarChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = { option: {}, loading: true };
    }

    async componentDidMount() {
        try {
            const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';
            const response = await axios.get(`${API_URL}/api/movies/count-by-country`);
            const data = response.data;
            
            const newOption = {
                title: { text: '电影产地数量Top15 (国家/地区)', left: 'center' },
                tooltip: { trigger: 'axis' },
                xAxis: { type: 'category', data: data.categories, axisLabel: { interval: 0, rotate: 30 } },
                yAxis: { type: 'value' },
                series: [{ data: data.values, type: 'bar' }],
                dataZoom: [{ type: 'inside' }] // 添加缩放功能
            };
            
            this.setState({ option: newOption, loading: false });
        } catch (error) {
            console.error("加载数据失败:", error);
            this.setState({ loading: false });
        }
    }

    render() {
        if (this.state.loading) return <div>图表加载中...</div>;
        return <ReactECharts option={this.state.option} style={{ height: '500px', width: '100%' }} />;
    }
}
export default MovieBarChart;