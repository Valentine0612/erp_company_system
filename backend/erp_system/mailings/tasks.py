from erp_system.celery import app
from django.conf import settings
from django.core.mail import EmailMessage
from django.template.loader import get_template


@app.task
def send_email(template, subject, context):

    message = get_template(template).render(context)

    mail = EmailMessage(
        subject=subject,
        body=message,
        to=context['email'],
    )

    if context.get('files'):
        for path in context['files']:
            mail.attach_file(path)
    mail.content_subtype = "html"
    if settings.DEBUG:
        print(message)
    else:
        mail.send()
