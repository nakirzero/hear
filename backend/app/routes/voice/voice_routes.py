from flask import Blueprint, jsonify
import requests
from app.config import Config

voice_routes = Blueprint('voice_routes', __name__)

ELEVENLABS_VOICE_API_URL = "https://api.elevenlabs.io/v1/voices"

@voice_routes.route('/voices', methods=['GET'])
def get_voices():
    headers = {
        'Accept': 'application/json',
        'xi-api-key': Config.ELEVENLABS_API_KEY  # 환경 변수에서 API 키 가져오기
    }
    
    try:
        response = requests.get(ELEVENLABS_VOICE_API_URL, headers=headers)
        print('response', response)
        response.raise_for_status()
        return jsonify(response.json())
    except requests.RequestException as e:
        print(f"Error fetching voices: {e}")
        return jsonify({'error': 'An error occurred while fetching voices.'}), 500
