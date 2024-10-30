from flask import Blueprint, jsonify
from app.model import get_db_connection, close_db_connection
from sqlalchemy import text

library_bp = Blueprint('library', __name__)

# 도서마당
@library_bp.route('/library', methods=['GET'])
def library():
    connection = get_db_connection()
 
    if connection:
        try:
            # 도서마당 전체 불러오는 쿼리
            query = text("SELECT * FROM book ")
            result = connection.execute(query)
          
            # 결과를 딕셔너리 형태로 변환
            keys = result.keys()
            book = [
                dict(zip(keys, row))
                for row in result.fetchall()
            ]
           
            for item in book:
                item['test'] = '/static/audio/Butter Ringtone.mp3'
                
            return jsonify(book)
        except Exception as db_error:
            print(f"Database operation failed: {db_error}")
            return jsonify({"error": "Failed to fetch library"}), 500

        finally:
            # 데이터베이스 연결 닫기
            close_db_connection(connection)

    return jsonify({"error": "Database connection failed"}), 500