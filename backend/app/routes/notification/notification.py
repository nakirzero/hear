from flask import Blueprint, jsonify, request
from app.utils.sse_utils import get_sse_response
from app.model import get_db_connection, close_db_connection
from sqlalchemy import text

notification_bp = Blueprint('notification', __name__)

# SSE 스트림 엔드포인트
@notification_bp.route('/notification/stream', methods=['GET'])
def stream():
    return get_sse_response()

# 알림 가져오기 엔드포인트
@notification_bp.route('/notification/notifications', methods=['GET'])
def get_notifications():
    connection = get_db_connection()
    if connection:
        try:
            query = text("""
                SELECT 
                    n.NOTI_SEQ, 
                    n.USER_SEQ, 
                    u.NICKNAME, 
                    n.NOTI_TYPE, 
                    n.REF_SEQ, 
                    n.NOTI_READ_YN, 
                    n.NOTI_CREATE_DT
                FROM notifications n
                JOIN user u ON n.USER_SEQ = u.USER_SEQ
                WHERE n.NOTI_READ_YN = 'N'
                ORDER BY n.NOTI_CREATE_DT DESC
            """)
            result = connection.execute(query)
            notifications = [row._asdict() for row in result.fetchall()]

            return jsonify(notifications), 200
        except Exception as db_error:
            print(f"Failed to fetch notifications: {db_error}")
            return jsonify({"error": "Failed to fetch notifications"}), 500
        finally:
            close_db_connection(connection)

    return jsonify({"error": "Database connection failed"}), 500
