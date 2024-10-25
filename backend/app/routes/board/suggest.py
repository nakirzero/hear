# app/routes/board/notice.py
from flask import Blueprint, jsonify
from app.model import get_db_connection, close_db_connection
from sqlalchemy import text

suggest_bp = Blueprint('suggest', __name__)

# 건의사항 전체 조회 (Read)
@suggest_bp.route('/suggests', methods=['GET'])
def get_all_suggests():
    # MySQL 데이터베이스 연결
    connection = get_db_connection()

    if connection:
        try:
            # 건의사항 조회 쿼리
            query = text("""
                SELECT n.NOTICE_SEQ, n.USER_SEQ, n.NOTICE_DIV, n.NOTICE_TITLE, n.NOTICE_DETAIL, 
                       n.NOTICE_CrtDt, n.NOTICE_MdfDt, u.NICKNAME
                FROM notice n
                LEFT JOIN user u ON n.USER_SEQ = u.USER_SEQ
                WHERE n.NOTICE_DIV = 2
                ORDER BY n.NOTICE_CrtDt DESC
            """)
            result = connection.execute(query)

            # 결과를 딕셔너리 형태로 변환
            keys = result.keys()
            suggests = [
                dict(zip(keys, row))
                for row in result.fetchall()
            ]

            return jsonify(suggests)
        except Exception as db_error:
            print(f"Database operation failed: {db_error}")
            return jsonify({"error": "Failed to fetch suggests"}), 500

        finally:
            # 데이터베이스 연결 닫기
            close_db_connection(connection)

    return jsonify({"error": "Database connection failed"}), 500
