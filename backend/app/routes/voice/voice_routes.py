from flask import Blueprint, jsonify, request
import requests
import os
from app.config import Config
from app.model import get_db_connection
from sqlalchemy import text
from datetime import datetime

voice_routes = Blueprint('voice_routes', __name__)

ELEVENLABS_VOICE_API_URL = "https://api.elevenlabs.io/v1/voices"
ELEVENLABS_VOICE_ADD_API_URL = "https://api.elevenlabs.io/v1/voices/add"
UPLOAD_FOLDER = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../static/audio'))

@voice_routes.route('/voices', methods=['GET'])
def get_voices():
    headers = {
        'Accept': 'application/json',
        'xi-api-key': Config.ELEVENLABS_API_KEY
    }
    
    try:
        response = requests.get(ELEVENLABS_VOICE_API_URL, headers=headers)
        response.raise_for_status()
        return jsonify(response.json())
    except requests.RequestException as e:
        print(f"Error fetching voices: {e.response.text if e.response else e}")
        return jsonify({'error': 'An error occurred while fetching voices.'}), 500

@voice_routes.route('/voice/upload-and-add', methods=['POST'])
def upload_and_add_voice():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # 서버에 파일 저장
    filename = "recording.wav"
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    try:
        file.save(file_path)
        print(f"File saved at {file_path}")
    except Exception as e:
        print(f"Error saving file: {e}")
        return jsonify({"error": "Failed to save file"}), 500

    # ElevenLabs API에 파일 업로드
    try:
        # 파일을 multipart/form-data로 전송
        with open(file_path, 'rb') as audio_file:
            files = [
                ('files', (filename, audio_file, 'audio/wav'))
            ]
            voice_name = request.form.get('voiceName', 'Custom Voice')  # 프론트에서 전달된 voiceName을 가져옴
            data = {
                'name': voice_name,
                'remove_background_noise': True,  # Boolean 값으로 설정
                'description': 'Voice added via API',
                'labels': '{}'
            }
            headers = {
                'xi-api-key': Config.ELEVENLABS_API_KEY
            }

            response = requests.post(ELEVENLABS_VOICE_ADD_API_URL, headers=headers, data=data, files=files)
            response.raise_for_status()

            # ElevenLabs에서 받은 voice_id 추출
            voice_data = response.json()
            elevenlabs_voice_id = voice_data.get('voice_id')

            # Voice 정보 DB에 저장
            connection = get_db_connection()
            if connection:
                try:
                    query = text("""
                        INSERT INTO voice_list (USER_SEQ, EL_ID, VL_NAME, VL_SPEED, VL_PITCH, VL_CrtDt) 
                        VALUES (:user_seq, :el_id, :vl_name, :vl_speed, :vl_pitch, now())
                    """)
                    # USER_SEQ는 프론트에서 받아온다고 가정
                    user_seq = request.form.get('userSeq', None)
                    if not user_seq:
                        return jsonify({"error": "User sequence is required"}), 400

                    connection.execute(query, {
                        "user_seq": user_seq,
                        "el_id": elevenlabs_voice_id,
                        "vl_name": voice_name,
                        "vl_speed": 1,  # 기본 속도, 필요시 프론트에서 받도록 수정 가능
                        "vl_pitch": 1   # 기본 피치, 필요시 프론트에서 받도록 수정 가능
                    })
                    connection.commit()

                    return jsonify({"message": "Voice added successfully", "data": voice_data}), 200
                except Exception as db_error:
                    print(f"Database operation failed: {db_error}")
                    return jsonify({"error": "Database operation failed"}), 500
                finally:
                    connection.close()
            else:
                return jsonify({"error": "Database connection failed"}), 500
    except requests.RequestException as e:
        if e.response is not None:
            print(f"Error adding voice to ElevenLabs: {e.response.text}")
            print(f"Response Status Code: {e.response.status_code}")
            print(f"Response Headers: {e.response.headers}")
        else:
            print(f"Error adding voice to ElevenLabs: {e}")

        return jsonify({"error": "Failed to add voice to ElevenLabs."}), 500

