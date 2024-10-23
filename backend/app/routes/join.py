from flask import request, jsonify, Blueprint
from app.model import get_db_connection
from sqlalchemy import text

# Blueprint를 사용하여 라우트 분리
join_bp = Blueprint('join', __name__)

@join_bp.route('/join', methods=['POST'])
def join():
    data = request.get_json()
    id = data.get('userId')
    pw = data.get('pw')
    disabled = data.get('disabled')    
    

    connection = get_db_connection()
    if connection:
        try:
            # 1. 사용자 ID가 이미 존재하는지 확인
            check_query = text("SELECT COUNT(*) FROM user WHERE USER_ID = :id")
            result = connection.execute(check_query, {"id": id}).scalar()
            
            if result > 0:
                # 2. 이미 존재하는 사용자라면 에러 반환
                return jsonify({"error": "User ID already exists"}), 409
            nick = { }
            # 사용자가 존재하지 않으면 새로운 사용자 추가
            query = text("INSERT INTO user (USER_ID, USER_PW, DISABLED_CODE, USER_CrtDt) VALUES (:id, :pw, :disabled, now())")
            connection.execute(query, {"id": id, "pw": pw, "disabled": disabled})
            connection.commit()
            
            return jsonify({"message": True})

        except Exception as db_error:
            print(f"Database operation failed: {db_error}")
            return jsonify({"error": "Database operation failed"}), 500
        finally:
            connection.close()

    return jsonify({"error": "Database connection failed"}), 500
