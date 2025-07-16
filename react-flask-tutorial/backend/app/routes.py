from flask import Blueprint, jsonify, request
from .services import ChartDataService
from .models import User, Movie, db
from flask_jwt_extended import create_access_token, jwt_required

api_bp = Blueprint('api', __name__)
chart_service = ChartDataService()

# --- 认证路由 ---
# ... (register 和 login 函数保持不变) ...
@api_bp.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({"msg": "缺少用户名或密码"}), 400
    username = data.get('username')
    password = data.get('password')
    if User.query.filter_by(username=username).first():
        return jsonify({"msg": "用户名已存在"}), 409
    new_user = User(username=username)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"msg": "用户注册成功"}), 201

@api_bp.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({"msg": "缺少用户名或密码"}), 400
    username = data.get('username')
    password = data.get('password')
    user = User.query.filter_by(username=username).first()
    if user and user.check_password(password):
        access_token = create_access_token(identity=username)
        return jsonify(access_token=access_token)
    return jsonify({"msg": "用户名或密码错误"}), 401


# --- 电影数据路由 (请仔细核对这里的路径) ---
@api_bp.route('/movies/count-by-country', methods=['GET'])
@jwt_required()
def get_movie_count_by_country_data():
    data = chart_service.get_movie_count_by_country()
    if data:
        return jsonify(data)
    return jsonify({"error": "No data available"}), 404

@api_bp.route('/movies/count-by-genre', methods=['GET'])
@jwt_required()
def get_movie_count_by_genre_data():
    data = chart_service.get_movie_count_by_genre()
    if data:
        return jsonify(data)
    return jsonify({"error": "No data available"}), 404
    
@api_bp.route('/movies/all-data', methods=['GET'])
@jwt_required()
def get_all_movie_data():
    try:
        records = Movie.query.order_by(Movie.id).all()
        # 如果没有记录，直接返回一个空列表，这是正常的
        if not records:
            return jsonify([])
        
        # 确保所有字段都能被正确处理
        data = [
            {
                "id": r.id,
                "title": r.title or "", # 如果 title 是 None，返回空字符串
                "country": r.country or "N/A", # 如果 country 是 None，返回 'N/A'
                "genre": r.genre or "N/A" # 如果 genre 是 None，返回 'N/A'
            } 
            for r in records
        ]
        return jsonify(data)
    except Exception as e:
        print(f"Error in get_all_movie_data: {e}")
        return jsonify({"error": "Failed to retrieve data from server"}), 500