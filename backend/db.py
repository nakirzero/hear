import pymysql  # PyMySQL 사용
from config import Config

def get_db_connection():
    try:
        connection = pymysql.connect(
            user=Config.DB_USER,
            password=Config.DB_PASSWORD,
            host=Config.DB_HOST,
            port=Config.DB_PORT,
            database=Config.DB_NAME
        )
        return connection
    except pymysql.Error as err:
        print(f"Database connection error: {err}")
        return None