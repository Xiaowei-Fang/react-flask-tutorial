# backend/app/__init__.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from config import config

db = SQLAlchemy()
cors = CORS()

def create_app(config_name='default'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])

    # 初始化扩展
    db.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

    # 注册 API 蓝图
    from .routes import api_bp
    app.register_blueprint(api_bp, url_prefix='/api')
    
    from manage import cli as db_cli
    print("DEBUG: 正在注册 'db' 命令...") # 调试信息
    app.cli.add_command(db_cli, 'db')
    print("DEBUG: 'db' 命令注册完毕。") 

    return app

origins = [
    "http://localhost:3000",
    "react-flask-tutorial.vercel.app" 
]
cors.init_app(app, resources={r"/api/*": {"origins": origins}})
