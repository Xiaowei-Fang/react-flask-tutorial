# backend/app/commands.py
import click
from flask.cli import with_appcontext
from . import db
from .models import User, Movie

# 1. Create a click Group. This is our main command entry point.
@click.group(name='db')
def db_cli():
    """数据库管理命令"""
    pass

# 2. Add commands to this group
@db_cli.command("init")
@with_appcontext
def init_db_command():
    """创建所有数据库表 (例如 users 表)"""
    try:
        db.create_all()
        click.echo('数据库表检查/创建完毕。')
    except Exception as e:
        click.echo(f'创建数据库表时出错: {e}')
        click.echo('请确保 MySQL 服务已启动，并且 config.py 中的数据库连接信息正确。')

@db_cli.command("create-user")
@click.argument('username')
@click.argument('password')
@with_appcontext
def create_user_command(username, password):
    """创建一个新用户"""
    if User.query.filter_by(username=username).first():
        click.echo(f'用户 "{username}" 已存在。')
        return
    
    user = User(username=username)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    click.echo(f'用户 "{username}" 创建成功。')

@db_cli.command("show-users")
@with_appcontext
def show_users_command():
    """显示所有已注册的用户"""
    users = User.query.all()
    if not users:
        click.echo("数据库中没有用户。")
        return
    click.echo("--- 已注册用户 ---")
    for user in users:
        click.echo(f"ID: {user.id}, 用户名: {user.username}")