
import click
from flask.cli import with_appcontext

from app import db
from app.models import MicrosoftRevenue

# 1. 创建一个命令组，但它不立即绑定到任何东西
cli = click.Group(name='db_cli', help='数据库管理命令行工具')

# 2. 在这个命令组上定义命令
@cli.command("init")
@with_appcontext
def init_db():
    """创建所有数据库表并插入初始数据"""
    click.echo('正在创建数据库表...')
    db.create_all()
    click.echo('数据库表创建完成。')
    
    if MicrosoftRevenue.query.count() == 0:
        click.echo('数据库为空，正在插入初始数据...')
        mock_data = [
            MicrosoftRevenue(department='Azure', quarter='Q1 2024', revenue=25.9),
            MicrosoftRevenue(department='Office', quarter='Q1 2024', revenue=13.5),
            MicrosoftRevenue(department='Xbox', quarter='Q1 2024', revenue=3.9),
            MicrosoftRevenue(department='Windows', quarter='Q1 2024', revenue=5.3),
            MicrosoftRevenue(department='Surface', quarter='Q1 2024', revenue=1.1),
            MicrosoftRevenue(department='Azure', quarter='Q4 2023', revenue=24.3),
            MicrosoftRevenue(department='Office', quarter='Q4 2023', revenue=13.1),
            MicrosoftRevenue(department='Xbox', quarter='Q4 2023', revenue=5.4),
        ]
        db.session.bulk_save_objects(mock_data)
        db.session.commit()
        click.echo('初始数据插入完成。')

@cli.command("add")
@click.option('--department', prompt='业务部门')
@click.option('--quarter', prompt='季度 (例如 Q1 2024)')
@click.option('--revenue', prompt='收入 (亿美元)', type=float)
@with_appcontext
def add(department, quarter, revenue):
    """添加新的收入记录"""
    record = MicrosoftRevenue(department=department, quarter=quarter, revenue=revenue)
    db.session.add(record)
    db.session.commit()
    click.echo(f"成功添加记录: {department} | {quarter} | ${revenue}B")

@cli.command("show")
@with_appcontext
def show():
    """显示数据库中的所有记录"""
    records = MicrosoftRevenue.query.order_by(MicrosoftRevenue.quarter, MicrosoftRevenue.department).all()
    if not records:
        click.echo("数据库中没有数据。")
        return
    click.echo("-----------------------------------------------")
    click.echo(f"{'部门':<20} | {'季度':<15} | 收入 (亿美元)")
    click.echo("-----------------------------------------------")
    for r in records:
        click.echo(f"{r.department:<20} | {r.quarter:<15} | ${r.revenue}")
    click.echo("-----------------------------------------------")