from django.dispatch import receiver

from mailings.tasks import send_email
from django_rest_passwordreset.signals import reset_password_token_created
from .utils import get_password_url


@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):

    #get reset password url
    url = get_password_url(instance.request, reset_password_token.key)
    
    # send an e-mail to the user
    context = {
        'login': reset_password_token.user.login,
        'email': [reset_password_token.user.email],
        'reset_password_url': url
    }

    send_email.delay(
        template="reset_password_email.html",
        subject="CyberPay - Сброс пароля",
        context=context
    )
