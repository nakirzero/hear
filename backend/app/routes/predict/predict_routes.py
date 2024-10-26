import sys
from flask import Blueprint, request, jsonify
import pickle
from kiwipiepy import Kiwi, basic_typos_with_continual
from app.model import get_db_connection, close_db_connection
from sqlalchemy import text

predict_bp = Blueprint('predict', __name__)

# Kiwi 형태소 분석기 객체 생성 및 함수 정의
kiwi = Kiwi(typos=basic_typos_with_continual)

def myTokenizer(text):
    result = kiwi.tokenize(text)
    for token in result:
        if token.tag in ['NNG', 'NNP']:
            yield token.form

def model_load():
    # `myTokenizer`를 `__main__`에 추가하여 pickle이 인식할 수 있게 함
    sys.modules['__main__'].myTokenizer = myTokenizer
    # 모델 로드 - app/models/ 폴더에서 직접 파일 로드
    with open('app/models/tfidf_vectorizer.pkl', 'rb') as f:
        tfidf = pickle.load(f)

    with open('app/models/category_model.pkl', 'rb') as f:
        logi = pickle.load(f)

    print("모델 로드 완료")

    # 타겟 이름 정의 (예측 결과를 해석하기 위한 라벨)
    target_names = ['맛집', '여행', '날씨', '건강정보', '요리', '상품설명', '인터뷰', '기타']

    return tfidf, logi, target_names

# 예측 API 엔드포인트
@predict_bp.route('/predict', methods=['POST'])
def predict():
    # model 로드를 한번만 할 수 있게 방안 모색
    tfidf, logi, target_names = model_load()
    # 클라이언트에서 텍스트 받기
    data = request.json
    sentence = data.get('sentence', '')

    if not sentence:
        return jsonify({"error": "카테고리를 분류할 문장이 필요합니다."}), 400

    # 예측을 위한 벡터화
    vect_sentence = tfidf.transform([sentence])

    # 예측 수행
    pre = logi.predict(vect_sentence)
    probabilities = logi.predict_proba(vect_sentence)

    # 결과 및 확률 정리
    predicted_index = pre[0] if isinstance(pre[0], int) else target_names.index(pre[0])
    max_probability = probabilities.max() * 100

    result = {
        "sentence": sentence,
        "predicted_category": target_names[predicted_index],
        "confidence": f"{max_probability:.2f}%"
    }

    # 예측 결과를 JSON 테이블의 JSON_DIVISION에 저장
    connection = get_db_connection()
    if connection:
        try:
            # JSON 테이블의 JSON_DIVISION 업데이트
            update_query = text("""
                UPDATE json 
                SET JSON_DIVISION = :category 
                WHERE JSON_DETAIL = :sentence
            """)
            connection.execute(update_query, {
                "category": target_names[predicted_index],
                "sentence": sentence
            })
            connection.commit()
        except Exception as db_error:
            print(f"Database operation failed: {db_error}")
            return jsonify({"error": "Database operation failed"}), 500
        finally:
            close_db_connection(connection)

    return jsonify(result)

# JSON_DETAIL 가져오기 API 엔드포인트
@predict_bp.route('/get_json_detail/<int:index>', methods=['GET'])
def get_json_detail(index):
    connection = get_db_connection()
    if connection:
        try:
            # 인덱스에 맞는 JSON_DETAIL 가져오기
            query = text(f"SELECT JSON_DETAIL FROM json LIMIT 1 OFFSET {index}")
            result = connection.execute(query)
            json_detail = result.fetchone()
            if json_detail:
                return jsonify({"json_detail": json_detail[0]}), 200
            else:
                return jsonify({"error": "더 이상 불러올 데이터가 없습니다."}), 404
        except Exception as db_error:
            print(f"Database operation failed: {db_error}")
            return jsonify({"error": "Database operation failed"}), 500
        finally:
            close_db_connection(connection)
    
    return jsonify({"error": "Database connection failed"}), 500
