from flask import Blueprint, jsonify, request
from app.model import get_db_connection, close_db_connection
from sqlalchemy import text


# wishbook 블루프린트 생성
noticeWrite_bp = Blueprint('noticeWrite', __name__)

# 1. 희망 도서 목록 조회 (관리자용)
@noticeWrite_bp.route('/admin/noticeWrite', methods=['POST'])
def noticeWrite():
    data = request.get_json()   
    user_seq = data.get('userseq')
    title = data.get('title')
    detail = data.get('detail')
    print(data,"data")
    if not all([user_seq, title, detail]):
        return jsonify({'error': '모든 필드를 입력해주세요.'}), 400

    # 데이터베이스 연결
    connection = get_db_connection()

    if connection:
        try:
            # SQL 삽입문
            query = text("""
                INSERT INTO notice (USER_SEQ, NOTICE_DIV, NOTICE_TITLE, NOTICE_DETAIL, NOTICE_CrtDt)
                VALUES (:user_seq, :notice_div, :title, :detail, NOW())
            """)
            connection.execute(query, {
                'user_seq': user_seq,
                'notice_div': 1,  
                'title': title,
                'detail': detail,
            })

            # 커밋 후 성공 응답 반환
            connection.commit()
            return jsonify({'message': '게시글이 성공적으로 작성되었습니다.'}), 201
        except Exception as e:
            print(f"Database Error: {e}")
            return jsonify({'error': '데이터베이스 오류'}), 500
        finally:
            # 데이터베이스 연결 닫기
            close_db_connection(connection)
    else:
        return jsonify({'error': '데이터베이스 연결 실패'}), 500

    
    
