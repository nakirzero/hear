from flask import Blueprint, jsonify, request
from app.model import get_db_connection, close_db_connection
from sqlalchemy import text

bookreport_bp = Blueprint('bookreport', __name__)

# 독서노트 목록 조회 (Read)
@bookreport_bp.route('/bookreport', methods=['GET'])
def get_book_reports():
    user_seq = request.args.get('userSeq', type=int)

    # userSeq가 없는 경우 에러 메시지 반환
    if user_seq is None:
        return jsonify({"error": "userSeq parameter is required"}), 400

    # MySQL 데이터베이스 연결
    connection = get_db_connection()

    if connection:
        try:
            # 독서노트 목록 조회 쿼리
            query = text("""
                SELECT REPORT_SEQ, USER_SEQ, BOOK_SEQ, REPORT_TITLE, 
                       REPORT_DETAIL, RATING, REPORT_CrtDt, REPORT_MdfDt
                FROM report
                WHERE USER_SEQ = :user_seq
                ORDER BY REPORT_CrtDt DESC
            """)
            result = connection.execute(query, {"user_seq": user_seq})

            # 결과를 딕셔너리 형태로 변환
            keys = result.keys()
            book_reports = [dict(zip(keys, row)) for row in result.fetchall()]

            return jsonify(book_reports)
        except Exception as db_error:
            print(f"Database operation failed: {db_error}")
            return jsonify({"error": "Failed to fetch book reports"}), 500

        finally:
            # 데이터베이스 연결 닫기
            close_db_connection(connection)

    return jsonify({"error": "Database connection failed"}), 500

# 독서노트 작성 (Create)
@bookreport_bp.route('/bookreport', methods=['POST'])
def create_book_report():
    data = request.get_json()

    # 필수 필드 확인
    required_fields = ['userseq', 'nickname', 'title', 'detail', 'rating']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    connection = get_db_connection()
    if connection:
        try:
            query = text("""
                INSERT INTO report (USER_SEQ, REPORT_TITLE, REPORT_DETAIL, RATING, REPORT_CrtDt)
                VALUES (:user_seq, :title, :detail, :rating, NOW())
            """)
            connection.execute(query, {
                "user_seq": data['userseq'],
                "title": data['title'],
                "detail": data['detail'],
                "rating": data['rating']
            })
            connection.commit()  # MySQL인 경우 커밋 필요

            return jsonify({"message": "Book report created successfully"}), 201
        except Exception as db_error:
            print(f"Database operation failed: {db_error}")
            return jsonify({"error": "Failed to create book report"}), 500
        finally:
            close_db_connection(connection)

    return jsonify({"error": "Database connection failed"}), 500
