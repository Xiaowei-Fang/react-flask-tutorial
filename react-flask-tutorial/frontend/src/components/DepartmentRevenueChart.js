import React from 'react';
import ReactECharts from 'echarts-for-react';

class DepartmentRevenueChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      option: {},
      loading: true,
    };
  }

  // 组件挂载后执行，适合发起网络请求
  async componentDidMount() {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/ms/department-revenue');
      const data = await response.json();
      
      const newOption = {
        title: { text: '微软各业务部门总收入', left: 'center' },
        tooltip: { trigger: 'axis', formatter: '{b}: ${c}B' },
        xAxis: { type: 'category', data: data.categories },
        yAxis: { type: 'value', name: '收入(亿美元)' },
        series: [{ data: data.values, type: 'bar' }],
      };
      
      // 使用 this.setState 更新状态，会触发重新渲染
      this.setState({ option: newOption, loading: false });
    } catch (error) {
      console.error("Failed to fetch department revenue data:", error);
      this.setState({ loading: false });
    }
  }

  // render 方法负责渲染UI
  render() {
    if (this.state.loading) {
      return <div>图表加载中...</div>;
    }
    return <ReactECharts option={this.state.option} style={{ height: '500px', width: '100%' }} />;
  }
}

export default DepartmentRevenueChart;