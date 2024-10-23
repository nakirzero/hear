from flask import Flask, request, jsonify, Blueprint
from app.model import get_db_connection, close_db_connection
from sqlalchemy import text

app = Flask(__name__)

# Blueprint를 사용하여 라우트 분리
login_bp = Blueprint('login', __name__)

@login_bp.route('/login', methods=['POST'])
def login():
    print('login!!')
    data = request.json  # Get JSON data from React
    userid = data.get('userid')
    userpw = data.get('userpw')

    print(f"Received User ID: {userid}, User PW: {userpw}")

    # Connect to the MySQL database
    connection = get_db_connection()

    if connection:
        try:
        # Query to find the user
             query = text("SELECT COUNT(*) FROM user WHERE USER_ID = :userid AND USER_PW =:userpw")
             result = connection.execute(query, {"userid": userid, "userpw": userpw})
             count = result.fetchone()[0] if result else 0

             if count > 0:
                return jsonify({"exists": True})
             else:
                return jsonify({"exists": False})
        except Exception as db_error:
            print(f"Database operation failed: {db_error}")
            return jsonify({"error": "Database operation failed"}), 500
        finally:
            close_db_connection(connection)  # 연결 닫기 함수 사용
    return jsonify({"error": "Database connection failed"}), 500
