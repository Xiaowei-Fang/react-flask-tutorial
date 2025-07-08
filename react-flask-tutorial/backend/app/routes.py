# backend/app/routes.py
from flask import Blueprint, jsonify, request
from .services import ChartDataService
from .models import MicrosoftRevenue

# 1. 创建蓝图对象
api_bp = Blueprint('api', __name__)

# 2. 实例化服务类
chart_service = ChartDataService()

# 3. 在蓝图上注册路由
@api_bp.route('/ms/department-revenue', methods=['GET'])
def get_department_revenue_data():
    data = chart_service.get_revenue_by_department()
    if data:
        return jsonify(data)
    return jsonify({"error": "No data available"}), 404

@api_bp.route('/ms/quarter-revenue', methods=['GET'])
def get_quarter_revenue_data():
    # 将默认值改为 'all'
    quarter = request.args.get('quarter', default='all', type=str)
    data = chart_service.get_revenue_by_quarter(quarter_filter=quarter)
    if data:
        return jsonify(data)
    return jsonify({"error": f"No data available for quarter {quarter}"}), 404

@api_bp.route('/ms/all-data', methods=['GET'])
def get_all_revenue_data():
    """返回所有收入记录，用于表格展示"""
    # 查询数据库中的所有记录
    records = MicrosoftRevenue.query.order_by(MicrosoftRevenue.id.desc()).all()
    
    # 将 SQLAlchemy 对象列表转换为字典列表 (JSON可序列化)
    data = [
        {
            "id": record.id,
            "department": record.department,
            "quarter": record.quarter,
            "revenue": record.revenue
        }
        for record in records
    ]
    
    return jsonify(data)

@api_bp.route('/ms/available-quarters', methods=['GET'])
def get_available_quarters_list():
    """返回所有不重复的季度列表"""
    quarters = chart_service.get_available_quarters()
    return jsonify(quarters)