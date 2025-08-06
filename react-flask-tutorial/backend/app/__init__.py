from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from config import config

# 1. 创建扩展实例
db = SQLAlchemy()
cors = CORS()
bcrypt = Bcrypt()
jwt = JWTManager()

def create_app(config_name='default'):
    """应用工厂函数"""
    app = Flask(__name__)
    
    # 2. 从配置对象加载配置
    app.config.from_object(config[config_name])

    # 3. 初始化扩展
    db.init_app(app)
    # 允许来自前端开发服务器和未来可能的部署地址的请求
    allowed_origins = [
        "http://localhost:3000",
        "https://react-flask-tutorial.vercel.app/" # 以后部署了可以换成这个
    ]
    cors.init_app(app, resources={r"/api/*": {"origins": allowed_origins}})
    bcrypt.init_app(app)
    jwt.init_app(app)

    # 4. 注册 API 蓝图
    from .routes import api_bp
    app.register_blueprint(api_bp, url_prefix='/api')
    
    # 5. 注册命令行命令 (如果你的 command.py 存在)
    from .commands import db_cli # 从 commands.py 导入我们定义的 click group
    app.cli.add_command(db_cli)  # 将这个命令组添加到 Flask 的 CLI 中

    return app