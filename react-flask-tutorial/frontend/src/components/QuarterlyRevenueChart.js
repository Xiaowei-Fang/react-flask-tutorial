// frontend/src/components/QuarterlyRevenueChart.js
import React from 'react';
import ReactECharts from 'echarts-for-react';
// 引入 Select 和 Spin 组件
import { Select, Spin, Alert, Space } from 'antd';

const { Option } = Select;

class QuarterlyRevenueChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      option: {},
      loading: true,
      error: null,
      availableQuarters: [], // 用于存放可选季度列表
      selectedQuarter: 'all', // 当前选中的季度，默认为 'all'
    };
  }

  // 组件加载时执行
  async componentDidMount() {
    await this.fetchAvailableQuarters(); // 首先获取可选季度列表
    await this.fetchChartData(this.state.selectedQuarter); // 然后获取默认的图表数据
  }
  
  // 方法1：获取所有可选的季度
  fetchAvailableQuarters = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/ms/available-quarters');
      if (!response.ok) throw new Error('无法获取季度列表');
      const data = await response.json();
      this.setState({ availableQuarters: data });
    } catch (error) {
      console.error("Failed to fetch available quarters:", error);
      this.setState({ error: error.message });
    }
  }

  // 方法2：根据指定季度获取图表数据
  fetchChartData = async (quarter) => {
    try {
      this.setState({ loading: true, error: null }); // 开始获取数据，显示加载中
      const response = await fetch(`http://127.0.0.1:5000/api/ms/quarter-revenue?quarter=${quarter}`);
      if (!response.ok) throw new Error(`无法获取 ${quarter} 的图表数据`);
      const data = await response.json();
      
      const title = quarter === 'all' 
        ? '全部季度总收入分布' 
        : `微软 ${quarter} 各部门收入分布`;
        
      const newOption = {
        title: { text: title, left: 'center' },
        tooltip: { trigger: 'item', formatter: '{b}<br/>收入: ${c}B ({d}%)' },
        legend: { orient: 'vertical', left: 'left' },
        series: [{ name: '收入', type: 'pie', radius: '50%', data: data }],
      };

      this.setState({ option: newOption, loading: false });
    } catch (error) {
      console.error("Failed to fetch chart data:", error);
      this.setState({ loading: false, error: error.message });
    }
  }
  
  // 方法3：处理下拉菜单选择变化的事件
  handleQuarterChange = (value) => {
    this.setState({ selectedQuarter: value }); // 更新选中的季度
    this.fetchChartData(value); // 重新获取该季度的数据
  }

  render() {
    const { loading, option, error, availableQuarters, selectedQuarter } = this.state;

    if (error) {
      return <Alert message="错误" description={error} type="error" showIcon />;
    }

    return (
      <div>
        <Space style={{ marginBottom: 16 }}>
          <span>选择季度:</span>
          <Select
            value={selectedQuarter}
            style={{ width: 200 }}
            onChange={this.handleQuarterChange}
          >
            {/* 手动添加一个“全部季度”的选项 */}
            <Option value="all">全部季度</Option>
            {/* 动态生成其他季度选项 */}
            {availableQuarters.map(q => (
              <Option key={q} value={q}>{q}</Option>
            ))}
          </Select>
        </Space>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
          </div>
        ) : (
          <ReactECharts option={option} style={{ height: '500px', width: '100%' }} />
        )}
      </div>
    );
  }
}

export default QuarterlyRevenueChart;