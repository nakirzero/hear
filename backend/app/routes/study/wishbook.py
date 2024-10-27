from flask import Blueprint, jsonify, request
from app.model import get_db_connection, close_db_connection
from sqlalchemy import text

wishbook_bp = Blueprint('study', __name__)

# 희망 도서 목록 조회 (Read)
@wishbook_bp.route('/wishbooks', methods=['GET'])
def get_wishbooks():
    user_seq = request.args.get('userSeq', type=int)

    # userSeq가 없는 경우 에러 메시지 반환
    if user_seq is None:
        return jsonify({"error": "userSeq parameter is required"}), 400

    # MySQL 데이터베이스 연결
    connection = get_db_connection()

    if connection:
        try:
            # 희망 도서 목록 조회 쿼리
            query = text("""
                SELECT WB_SEQ, USER_SEQ, WB_NAME, WB_AUTHOR, WB_AplDt, 
                       WB_APPROVAL, WB_REASON, WB_COMENT
                FROM wishbook
                WHERE USER_SEQ = :user_seq
                AND WB_REASON = 0
                ORDER BY WB_AplDt DESC
            """)
            result = connection.execute(query, {"user_seq": user_seq})

            # 결과를 딕셔너리 형태로 변환
            keys = result.keys()
            wishbooks = [dict(zip(keys, row)) for row in result.fetchall()]

            return jsonify(wishbooks)
        except Exception as db_error:
            print(f"Database operation failed: {db_error}")
            return jsonify({"error": "Failed to fetch wish books"}), 500

        finally:
            # 데이터베이스 연결 닫기
            close_db_connection(connection)

    return jsonify({"error": "Database connection failed"}), 500

# 희망 도서 취소 (Update WB_REASON to 1)
@wishbook_bp.route('/wishbooks/<int:wishbook_id>/cancel', methods=['PUT'])
def cancel_wishbook(wishbook_id):
    connection = get_db_connection()

    if connection:
        try:
            query = text("""
                UPDATE wishbook
                SET WB_REASON = 1
                WHERE WB_SEQ = :wishbook_id
            """)
            connection.execute(query, {"wishbook_id": wishbook_id})
            connection.commit()  # 변경 사항 적용

            return jsonify({"success": True, "message": "Wish book canceled successfully"}), 200
        except Exception as db_error:
            print(f"Database operation failed: {db_error}")
            return jsonify({"error": "Failed to cancel wish book"}), 500
        finally:
            close_db_connection(connection)

    return jsonify({"error": "Database connection failed"}), 500
