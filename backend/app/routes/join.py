from flask import request, jsonify, Blueprint
from app.model import get_db_connection
from sqlalchemy import text
import app.utils.nickname as nickname


# Blueprint를 사용하여 라우트 분리
join_bp = Blueprint('join', __name__)

@join_bp.route('/join', methods=['POST'])
def join():
    data = request.get_json()
    id = data.get('userId')
    pw = data.get('pw')
    pwok = data.get('pwok')
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
            
            if pw != pwok :
                return jsonify({"error": "유저 패스워드 불일치"}), 410
            
            # 사용자가 존재하지 않으면 새로운 사용자 추가
            query = text("INSERT INTO user (USER_ID, USER_PW, NICKNAME, DISABLED_CODE, USER_CrtDt) VALUES (:id, :pw, :nickname, :disabled, now())")
            connection.execute(query, {"id": id, "pw": pw, "nickname": nickname.nickName(), "disabled": disabled})
            connection.commit()
            
            return jsonify({"message": True})

        except Exception as db_error:
            print(f"Database operation failed: {db_error}")
            return jsonify({"error": "Database operation failed"}), 500
        finally:
            connection.close()

    return jsonify({"error": "Database connection failed"}), 500
