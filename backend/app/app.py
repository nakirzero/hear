from flask import Flask, jsonify
from flask_cors import CORS
from app.routes.check_userid import check_userid_bp
from app.routes.join import join_bp

app = Flask(__name__)

# 전역 CORS 설정 적용
CORS(app)

# Blueprint 등록
app.register_blueprint(check_userid_bp, url_prefix='/api')
app.register_blueprint(join_bp, url_prefix='/api')

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)