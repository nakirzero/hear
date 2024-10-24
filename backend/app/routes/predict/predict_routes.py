import sys
from flask import Blueprint, request, jsonify
import pickle
from kiwipiepy import Kiwi, basic_typos_with_continual

predict_bp = Blueprint('predict', __name__)

# Kiwi 형태소 분석기 객체 생성 및 함수 정의
kiwi = Kiwi(typos=basic_typos_with_continual)

def myTokenizer(text):
    result = kiwi.tokenize(text)
    for token in result:
        if token.tag in ['NNG', 'NNP']:
            yield token.form

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

# 예측 API 엔드포인트
@predict_bp.route('/predict', methods=['POST'])
def predict():
    # 클라이언트에서 리뷰 텍스트 받기
    data = request.json
    review = data.get('review', '')

    if not review:
        return jsonify({"error": "리뷰 텍스트가 필요합니다."}), 400

    # 예측을 위한 벡터화
    vect_review = tfidf.transform([review])

    # 예측 수행
    pre = logi.predict(vect_review)
    probabilities = logi.predict_proba(vect_review)

    # 결과 및 확률 정리
    predicted_index = pre[0] if isinstance(pre[0], int) else target_names.index(pre[0])
    max_probability = probabilities.max() * 100

    result = {
        "review": review,
        "predicted_category": target_names[predicted_index],
        "confidence": f"{max_probability:.2f}%"
    }

    return jsonify(result)

