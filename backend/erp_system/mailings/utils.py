import pyotp
from django.conf import settings


def get_otp_password(otp_code):
    totp = pyotp.TOTP(
        otp_code,
        digits=settings.CODE_LENGTH,
        interval=settings.CODE_LIFETIME
    )
    return totp.now()


def check_otp_password(user_hash, code):
    totp = pyotp.TOTP(
        user_hash,
        digits=settings.CODE_LENGTH,
        interval=settings.CODE_LIFETIME
    )
    return totp.verify(code, valid_window=1)


def get_service_url(request):
    """
    Generate URL for main page of service
    """
    return request.build_absolute_uri().split('main')[0].replace('8', '3')
