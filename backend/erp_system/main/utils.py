import base64
from django.utils.crypto import get_random_string
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import datetime
from django.urls import reverse
from mailings.services import send_email_with_login_password
from django.conf import settings
from .models import User
from rest_framework.renderers import BaseRenderer


class BinaryFileRenderer(BaseRenderer):
    media_type = 'application/octet-stream'
    format = None
    charset = None
    render_style = 'binary'

    def render(self, data, media_type=None, renderer_context=None):
        return data


def get_tokens_for_user(user):
    """
    Create new pair access and refresh token for user
    """
    refresh = RefreshToken.for_user(user)

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


def gen_random_login_password():
    """
    Generate unique login and password for new User model
    """
    login = get_random_string(length=10)
    password = User.objects.make_random_password()

    while User.objects.filter(login=login).exists():
        login.get_random_string(length=10)

    return (login, password)


def create_manager(company, **user_data):
    """
    Create User model with field is_manager=True
    and send login and password to email
    """

    login, password = gen_random_login_password()

    user_data.update({'password': password})
    user_data.update({'login': login})
    user_data.update({'is_manager': True})
    user_data.update({'is_verified': True})

    user = User.objects.create_user(**user_data)
    user.company.add(company)
    
    # Create context for email
    context = {
        'email': [user.email],
        'login': login,
        'password': password
    }

    send_email_with_login_password(context)


def generate_company_hash(code: str, date_time, request):
    """
    Generate company link for registration new Workman
    """
    timestamp = datetime.timestamp(date_time)
    message = f'{code} {timestamp}'
    message_bytes = message.encode()
    base64_bytes = base64.b64encode(message_bytes)
    base64_message = base64_bytes.decode()
    path = request.build_absolute_uri(reverse('register_workman'))
    url = f'{path}?c={base64_message}'
    return url


def decode_company_hash(hash: str):
    """
    Decode query_params from URL for registration new Workman
    """
    base64_bytes = hash.encode()
    message_bytes = base64.b64decode(base64_bytes)
    code = message_bytes.decode().split()[0]
    return code


def get_company_id(request):
    if request.user.company.exists():
        company_data = request.user.company.first()
        return company_data.id
    return None


def get_password_url(request, token):

    domain = request.build_absolute_uri().split('password_reset')[0]

    if settings.DEBUG:
        domain = domain.replace('8', '3')

    url = "{}reset-password/confirm/?token={}".format(domain, token)
    return url


def check_user_in_company(company, user):
    """
    Return True if company contains user
    """
    try:
        employee = company.user.get(id=user.id)
    except User.DoesNotExist:
        employee = None
    return employee


def change_state_for_user_in_company(company_user, state):
    """
    Change user's state in CompanyUser model
    """
    company_user.state = state
    company_user.save()


def modify_input_for_multiple_files(profile_id, title, image):
    dict_data = {}
    dict_data['profile'] = profile_id
    dict_data['title'] = title
    dict_data['image'] = image
    return dict_data


def create_context_data_for_contract(request):
    manager = request.user
    context = {
        'manager_certificate': manager.open_code,
        'manager_created_at': manager.created_at
    }
    return context
