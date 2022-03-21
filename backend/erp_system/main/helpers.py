import base64
from datetime import datetime


EXTENTIONS = ['jpg', 'jpeg', 'png', 'pdf', 'heic']


def create_user_hash(created_at, open_code):
    """
    Create user's hash for user's folder
    """
    timestamp = datetime.timestamp(created_at)
    body = str(timestamp) + open_code[:6]
    message_bytes = body.encode()
    base64_bytes = base64.b64encode(message_bytes)
    base64_message = base64_bytes.decode()
    return base64_message


def create_file_name(title, filename):
    extention = filename.split('.')[-1].lower()
    date_time = datetime.now()
    timestamp = date_time.strftime("%Y%m%d%H%M%S")
    if extention in EXTENTIONS:
        file_name = f'{title}_{timestamp}.{extention}'
    else:
        file_name = f'{title}_{timestamp}.jpg'
    return file_name
