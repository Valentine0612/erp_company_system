from main.models import CompanyUser, Company, User
from main.utils import get_company_id
from rest_framework.exceptions import ParseError

from tinkoff_api.utils import add_recipient
from tinkoff_api.api_urls import accept_deal

from .models import Task


def get_CompanyUser_model(request, user_id):
    company = Company.objects.get(id=get_company_id(request))
    user = User.objects.get(id=user_id)
    company_user = CompanyUser.objects.get(company=company, user=user)
    return company_user


def modify_data_for_task_document_model(task, title, file):
    data = {}
    data['task'] = task
    data['title'] = title
    data['file'] = file
    return data 


def change_task_state(task, user):
    match task.state:
        case 'ISSUED':
            if not user.is_manager:
                task.state = 'STARTED'
                add_recipient(task, user)
                accept_deal(task.deal_id)
        case 'STARTED':
            if not user.is_manager:
                task.state = 'FINISHED'
        case 'FINISHED':
            if user.is_manager:
                task.state = 'CHECK'
        case 'CHECK':
            if  user.is_manager:
                task.state = 'CLOSED'
        case _:
            raise ParseError()
    task.save()


def check_id_in_request_data(list_of_obj, request_data):
    obj_id = []
    for obj in list_of_obj:
        obj_id.append(obj.id)
    return all(item in obj_id for item in request_data)


def get_last_number_of_task(task):
    try:
        count = Task.objects.filter(user__company=task.user.company).filter(is_completed=True).count()
    except:
        count = 0
    return count + 1


def save_deal_params(task, deal_params):
    task.deal_id = deal_params['deal_id']
    task.step_id = deal_params['step_id']
    task.save()
