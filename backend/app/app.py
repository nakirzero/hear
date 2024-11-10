from flask import Flask
from flask_cors import CORS
from app.routes import register_blueprints
from app.utils.sse_utils import get_sse_response

app = Flask(__name__)

# 전역 CORS 설정 적용
CORS(app)

# Blueprint 등록
register_blueprints(app)

@app.route('/stream')
def stream():
    return get_sse_response()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)