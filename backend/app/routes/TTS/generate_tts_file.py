import os
import requests
from flask import Blueprint, jsonify, request
from app.config import Config
from app.utils.random_sentence import get_random_sentence

tts_bp = Blueprint("tts", __name__)

# 파일 저장 경로 설정
PLAY_FOLDER = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../static/audio/play'))
PREVIEW_FOLDER = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../static/audio/preview'))
os.makedirs(PLAY_FOLDER, exist_ok=True)  # 폴더가 없으면 생성
os.makedirs(PREVIEW_FOLDER, exist_ok=True)  # 폴더가 없으면 생성

@tts_bp.route("/tts/generate", methods=["POST"])
def generate_tts():
    data = request.get_json()
    voice_id = data.get("voiceId")
    text = data.get("text")
    book_seq = data.get("bookSeq")

    # 필수 필드 확인 (preview 요청은 book_seq 없이 text 공백으로 전송)
    if not voice_id:
        return jsonify({"error": "voiceId는 필수입니다."}), 400

    # 미리듣기 요청 여부 확인
    is_preview = (book_seq == "preview" or not book_seq)
    if is_preview:
        text = text or get_random_sentence()  # 미리듣기 요청 시 랜덤 문장 사용
        save_folder = PREVIEW_FOLDER
        filename = f"preview_voice_{voice_id}.mp3"
    else:
        if not text or not book_seq:
            return jsonify({"error": "실제 TTS 파일 생성에는 voiceId, text, book_seq가 필요합니다."}), 400
        save_folder = PLAY_FOLDER
        filename = f"book_{book_seq}_voice_{voice_id}.mp3"

    file_path = os.path.join(save_folder, filename)

    # 파일 존재 여부 확인
    if os.path.exists(file_path):
        print(f"파일이 이미 존재합니다: {file_path}")
        return jsonify({"message": "파일이 이미 존재합니다.", "file_path": file_path}), 200

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
