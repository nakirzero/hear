from flask import Flask, jsonify
from flask_cors import CORS
from db import get_db_connection  # db.py에서 함수 가져오기
import traceback

app = Flask(__name__)

# 전역 CORS 설정 적용
CORS(app)

@app.route('/api/hello', methods=['GET'])
def hello():
    return jsonify(message="Hello from Flask!")

@app.route('/api/db_version', methods=['GET'])
def get_db_version():
    connection = get_db_connection()
    if connection:
        try:
            cursor = connection.cursor()
            cursor.execute("SELECT VERSION()")  # MySQL 서버 버전 확인
            version = cursor.fetchone()
            cursor.close()
            return jsonify(version=version[0])
        except Exception as e:
            print("Error occurred while fetching DB version:")
            print(traceback.format_exc())
            return jsonify(error="Failed to fetch DB version"), 500
        finally:
            connection.close()  # 연결을 항상 닫도록 설정
    else:
        return jsonify(error="Failed to connect to MySQL"), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)