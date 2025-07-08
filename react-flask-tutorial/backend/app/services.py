# backend/app/services.py
from .models import MicrosoftRevenue, db

class ChartDataService:
    """封装所有与图表数据相关的业务逻辑"""

    def get_revenue_by_department(self):
        query_result = db.session.query(
            MicrosoftRevenue.department,
            db.func.sum(MicrosoftRevenue.revenue).label('total_revenue')
        ).group_by(MicrosoftRevenue.department).order_by(db.desc('total_revenue')).all()

        if not query_result: return None
        
        departments = [row.department for row in query_result]
        revenues = [round(row.total_revenue, 2) for row in query_result]
        return {"categories": departments, "values": revenues}

    def get_revenue_by_quarter(self, quarter_filter='Q1 2024'):
 
        if quarter_filter == 'all':
            # 按季度分组汇总总收入
            query_result = db.session.query(
                MicrosoftRevenue.quarter,
                db.func.sum(MicrosoftRevenue.revenue).label('total_revenue')
            ).group_by(MicrosoftRevenue.quarter).order_by(MicrosoftRevenue.quarter).all()
            
            if not query_result: return None
            
            # 返回 ECharts 饼图需要的格式
            return [{"name": row.quarter, "value": round(row.total_revenue, 2)} for row in query_result]
        else:
            # 保持原来的逻辑：返回指定季度内各部门的收入
            query_result = MicrosoftRevenue.query.filter_by(quarter=quarter_filter).all()
            if not query_result: return None
            return [{"name": row.department, "value": row.revenue} for row in query_result]

    def get_available_quarters(self):
        # 使用 distinct() 来去重
        query_result = db.session.query(MicrosoftRevenue.quarter).distinct().order_by(MicrosoftRevenue.quarter.desc()).all()
        return [row[0] for row in query_result]