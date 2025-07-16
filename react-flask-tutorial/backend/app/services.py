# backend/app/services.py
from .models import Movie, db
from collections import Counter

class ChartDataService:
    """封装电影数据统计逻辑"""

    def get_movie_count_by_country(self):
        """按国家/地区统计电影数量，用于柱状图"""
        try:
            movies = Movie.query.all()
            if not movies: return None
            
            country_counter = Counter()
            for movie in movies:
                # --- 关键修复：先检查 movie.country 是否为 None 或空字符串 ---
                if movie.country:
                    countries = [c.strip() for c in movie.country.split('/') if c.strip()]
                    country_counter.update(countries)
            
            if not country_counter: return {"categories": [], "values": []}

            top_countries = country_counter.most_common(15)
            top_countries.sort(key=lambda x: x[1], reverse=True)

            categories = [item[0] for item in top_countries]
            values = [item[1] for item in top_countries]
            return {"categories": categories, "values": values}
        except Exception as e:
            # 捕获任何可能的异常，并打印到后端日志中，防止服务器崩溃
            print(f"Error in get_movie_count_by_country: {e}")
            return None # 返回 None，让路由处理 404

    def get_movie_count_by_genre(self):
        """按类型统计电影数量，用于饼图 (这个函数工作正常，但也增加健壮性)"""
        try:
            movies = Movie.query.all()
            if not movies: return None

            genre_counter = Counter()
            for movie in movies:
                # --- 同样的健壮性修复 ---
                if movie.genre:
                    genres = [g.strip() for g in movie.genre.split('/') if g.strip()]
                    genre_counter.update(genres)
            
            if not genre_counter: return [{"name": "无类型", "value": len(movies)}]

            top_genres = genre_counter.most_common(10)
            return [{"name": item[0], "value": item[1]} for item in top_genres]
        except Exception as e:
            print(f"Error in get_movie_count_by_genre: {e}")
            return None