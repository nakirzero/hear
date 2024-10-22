from sqlalchemy import create_engine
from sqlalchemy.pool import QueuePool
from .config import Config

# SQLAlchemy 엔진을 사용해 연결 풀 설정
engine = create_engine(
    f"mysql+pymysql://{Config.DB_USER}:{Config.DB_PASSWORD}@{Config.DB_HOST}:{Config.DB_PORT}/{Config.DB_NAME}",
    poolclass=QueuePool,
    pool_size=5,  # 최대 연결 개수
    max_overflow=10,  # 풀을 초과할 때 더 만들 수 있는 연결 수
    pool_timeout=30,  # 연결을 기다리는 시간
    echo=True  # SQLAlchemy의 로그 출력을 활성화
)

def get_db_connection():
    try:
        # 풀에서 연결을 가져옴
        connection = engine.connect()
        return connection
    except Exception as err:
        print(f"Database connection error: {err}")
        return None
