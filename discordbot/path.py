import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

JSON_DIR = os.path.join(BASE_DIR,"json")
EMAIL_JSON = os.path.join(JSON_DIR,"email.json")
ROLE_MAP_JSON = os.path.join(JSON_DIR,"role_map.json")
BOT_MESSAGE_JSON = os.path.join(JSON_DIR,"bot_msg.json")
VERSION_POST_JSON = os.path.join(JSON_DIR,"version_post.json")
VERSION_JSON = os.path.join(JSON_DIR,"version.json")