from .wishbook_routes import wishbook_bp
from .noticeWrite import noticeWrite_bp
from .upload_history import upload_history_bp

admin_blueprints = [wishbook_bp, noticeWrite_bp, upload_history_bp]
