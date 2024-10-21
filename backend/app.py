from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)

# 전역 CORS 설정 적용
CORS(app)

@app.route('/api/hello', methods=['GET'])
def hello():
    return jsonify(message="Hello from Flask!")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)