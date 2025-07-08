# backend/app/models.py
from . import db  # 从同级目录的 __init__.py 导入 db

class MicrosoftRevenue(db.Model):
    __tablename__ = 'microsoft_revenue' 
    id = db.Column(db.Integer, primary_key=True)
    department = db.Column(db.String(80), nullable=False)
    quarter = db.Column(db.String(10), nullable=False)
    revenue = db.Column(db.Float, nullable=False)

    def __repr__(self):
        return f'<MicrosoftRevenue {self.department} {self.quarter}: ${self.revenue}B>'