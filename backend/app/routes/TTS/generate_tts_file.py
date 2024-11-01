import os
import requests
from flask import Blueprint, jsonify, request, current_app
from app.config import Config

# TTS 관련 블루프린트 생성
tts_bp = Blueprint("tts", __name__)

# 파일 저장 경로 설정
UPLOAD_FOLDER = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../static/audio/play'))
os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # 폴더가 없으면 생성

@tts_bp.route("/tts/generate", methods=["POST"])
def generate_tts():
    data = request.get_json()
    voice_id = data.get("voiceId")
    text = data.get("text")
    book_seq = data.get("bookSeq")
    print('voice_id', voice_id)
    print('text', text)
    print('book_seq', book_seq)

    # 필수 필드 확인
    if not voice_id or not text or not book_seq:
        return jsonify({"error": "voiceId, text, book_seq는 필수입니다."}), 400

    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
    headers = {
        "Content-Type": "application/json",
        "xi-api-key": Config.ELEVENLABS_API_KEY,
        "Accept": "audio/mpeg"
    }
    payload = {
        "text": text,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.5
        }
    }

    # 파일명 설정 (book_seq와 voice_id 기반)
    filename = f"book_{book_seq}_voice_{voice_id}.mp3"
    file_path = os.path.join(UPLOAD_FOLDER, filename)

    # 파일 존재 여부 확인
    if os.path.exists(file_path):
        print(f"파일이 이미 존재합니다: {file_path}")
        return jsonify({"message": "파일이 이미 존재합니다.", "file_path": file_path}), 200

    try:
        # ElevenLabs API 호출
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()

        # 파일 저장
        with open(file_path, "wb") as audio_file:
            audio_file.write(response.content)
        print(f"TTS 파일 저장 완료: {file_path}")

        return jsonify({"message": "TTS 파일이 성공적으로 생성되었습니다.", "file_path": file_path}), 200

    except requests.exceptions.RequestException as e:
        print(f"ElevenLabs API 호출 중 오류 발생: {e}")
        return jsonify({"error": "TTS 생성에 실패했습니다."}), 500
