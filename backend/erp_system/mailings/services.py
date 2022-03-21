from django.conf import settings
from .tasks import send_email
from .utils import get_service_url, get_otp_password


def send_email_with_login_password(data):
    """
    Send login and password to email when user create account
    """
    send_email.delay(
        template="login_password_email.html",
        subject="CyberPay - Регистрация",
        context=data
    )


def send_info_about_new_employee(company, request):
    """
    Send Email to manager of company when new user create account
    """
    managers = company.user.filter(is_manager=True)
    # get all manager's emails
    emails = []
    for manager in managers:
        emails.append(manager.email)

    # create data for message
    data = {}
    data['url'] = get_service_url(request)
    data['company'] = company.full_name
    data['email'] = emails
    
    send_email.delay(
        template="new_employee_email.html",
        subject="CyberPay - Новый исполнитель",
        context=data
    )


def generate_email_with_contract(company_user, file_path):
    """
    Send email to user with contract when manager accept request
    """

    context = {
        'user': company_user.user.name,
        'email': [company_user.user.email],
        'files': [file_path],
    }

    send_email.delay(
        template="email_new_contract.html",
        subject=f"CyberPay - Договор с {company_user.company.full_name}",
        context=context
    )


def generate_email_with_close_document_of_task(company_user, file_path):
    """
    Send email to user with close document
    """

    context = {
        'user':company_user.user.get_full_name(),
        'company':company_user.company.full_name,
        'email':[company_user.user.email],
        'files':[file_path],
    }

    send_email.delay(
        template='email_with_close_document.html',
        subject=f"CyberPay - Закрывающий документ с {company_user.company.full_name}",
        context=context,
    )


def generate_email_with_otp_password(user):
    """
    Send email to user with otp password for confirmation action
    """
    code = get_otp_password(user['otp_code'])

    context = {
        'user': user['name'],
        'email': [user['email']],
        'otp_code': code
    }

    if settings.DEBUG:
        print(code)

    send_email.delay(
        template="email_with_otp_code.html",
        subject="CyberPay - Подтверждение действия",
        context=context
    )


def generate_email_with_task(task, user, company, documents, request):
    """
    Send email notification to user about new task 
    """
    context = {
        'user': user.get_full_name(),
        'company': company.full_name,
        'email': [user.email],
        'task': task,
        'files': [],
    }
    
    if documents:
        for document in documents:
            context['files'].append(document.file.path)

    send_email.delay(
        template="email_with_new_task.html",
        subject="CyberPay - Новое задание",
        context=context
    )
