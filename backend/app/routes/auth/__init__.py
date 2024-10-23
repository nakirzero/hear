from .login import login_bp
from .join import join_bp
from .check_userid import check_userid_bp

auth_blueprints = [login_bp, join_bp, check_userid_bp]
