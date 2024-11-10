from flask import Flask, Response
from flask_cors import CORS
from app.routes import register_blueprints

app = Flask(__name__)

# 전역 CORS 설정 적용
CORS(app, resources={
    r"/api/*": {
        "origins": ["https://h-ear.site", "http://localhost:3000"],  # 운영 도메인 추가
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"],
        "supports_credentials": True,
        "expose_headers": ["Content-Type"]
    }
})

# Blueprint 등록
register_blueprints(app)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
