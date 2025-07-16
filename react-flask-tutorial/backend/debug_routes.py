# backend/debug_routes.py
import os
import sys

# 确保导入路径正确，和 run.py 一样
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app import create_app

# 创建一个 app 实例，就像 run.py 做的一样
app = create_app('development')

# 这是核心：打印出所有已知的 URL 路由规则
with app.app_context():
    print("--- Flask 应用已知的 URL 路由规则 ---")
    for rule in app.url_map.iter_rules():
        print(f"Endpoint: {rule.endpoint:<35} Methods: {','.join(rule.methods):<25} URL: {rule}")
    print("------------------------------------")