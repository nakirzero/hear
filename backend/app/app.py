from flask import Flask, Response
from flask_cors import CORS
from app.routes import register_blueprints

app = Flask(__name__)

# 전역 CORS 설정 적용
CORS(app)

# Blueprint 등록
register_blueprints(app)

@app.after_request
def add_custom_headers(response):
    response.headers['Access-Control-Allow-Private-Network'] = 'true'  # 비공개 네트워크 허용
    response.headers['Access-Control-Allow-Origin'] = 'https://h-ear.site'  # 필요에 따라 수정
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    return response

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
