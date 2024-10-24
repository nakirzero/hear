from flask import Blueprint, request, jsonify

user_settings_bp = Blueprint('user_settings', __name__)

@user_settings_bp.route('/api/user/settings', methods=['POST'])
def save_user_settings():
    try:
        data = request.json
        selected_voice = data.get("selectedVoice")
        speed = data.get("speed")

        # 예시: 데이터베이스에 설정 저장 로직
        # new_setting = UserSettings(voice=selected_voice, speed=speed)
        # db.session.add(new_setting)
        # db.session.commit()

        return jsonify({"message": "Settings saved successfully."}), 200
    except Exception as e:
        print(f"Error saving user settings: {e}")
        return jsonify({"error": "Failed to save settings."}), 500
