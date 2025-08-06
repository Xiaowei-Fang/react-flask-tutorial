# backend/app/models.py
from . import db
from flask_bcrypt import Bcrypt
# Bcrypt 不需要 app 实例来初始化，可以直接创建
bcrypt = Bcrypt()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)
    
    def __repr__(self):
        return f'<User {self.username}>'
    

class Movie(db.Model):
    # 假设你的表名叫 'douban_top100'，主键是 'id'
    # 如果你的表名或主键名不同，请修改下面的 __tablename__ 和 id 定义
    __tablename__ = 'movies_top100' 
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)    # 电影名
    country = db.Column(db.String(255), nullable=False) # e.g., "美国 / 英国"
    genre = db.Column(db.String(255), nullable=False)   # e.g., "剧情 / 犯罪"
    
    def __repr__(self):
        return f'<Movie {self.title}>'
    
