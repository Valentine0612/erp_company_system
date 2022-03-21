import datetime
import os
import uuid
import pytz
import json
import re
from django.template.loader import get_template
from main.models import CompanyUserDocument, MetaDataUserDocument, CompanyUser
from django.conf import settings

from xhtml2pdf import pisa
from num2words import num2words

from mailings.services import generate_email_with_contract, generate_email_with_close_document_of_task
from main.helpers import create_user_hash

from tasks.services import get_last_number_of_task
from tasks.models import TaskDocument


TYPE_OF_CONTARCT = {
    'LLC_SP': 'LLC_SP.html',
    'LLC_SE': 'LLC_SE.html',
    'LLC_NP': 'LLC_NP.html',
    'LLC_FR': 'LLC_FR.html',
    'SP_SP': 'SP_SP.html',
    'SP_SE': 'SP_SE.html',
    'SP_NP': 'SP_NP.html',
    'SP_FR': 'SP_FR.html',
}


def get_last_number_of_contract(company):
    try:
        count = CompanyUserDocument.objects.filter(company=company).count()
    except:
        count = 0
    return count + 1


def get_user_folder_path(user):
    hash = create_user_hash(user.created_at, user.open_code)
    path = f'{settings.MEDIA_ROOT}/user_{hash}'
    return path


def render_to_pdf(template_src, context_dict={}, user_path=None, file_name=None):
    template = get_template(template_src)
    context_dict['STATIC_ROOT'] = settings.STATIC_ROOT
    html = template.render(context_dict)

    if file_name:
        name = file_name
    else:
        name = 'contract'

    with open(f'{user_path}/{name}.pdf', "wb") as f:
        pisa_status = pisa.CreatePDF(html, dest=f, encoding='utf-8')
        if pisa_status.err:
            return None
        return f


def create_context_data(company_user):
    """
    Add time to main context when user sign contract
    and update jsonfield in metadata model
    """
    meta_data = company_user.documents.get(
        title='Договор').metadatauserdocument
    dict_data = json.loads(meta_data.data)
    user_sign = {
        'is_user': True,
        'user_certificate': company_user.user.open_code,
        'user_created_at': company_user.user.created_at.astimezone(pytz.UTC).strftime('%Y-%m-%d %H:%M:%S'),
        'user_expired_at': company_user.user.created_at.replace(company_user.user.created_at.year+1).astimezone(pytz.UTC).strftime('%Y-%m-%d %H:%M:%S'),
        'user_datetime_sign': datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S'),
    }
    dict_data['sign'].update(user_sign)
    meta_data.data = json.dumps(dict_data, indent=4, sort_keys=True,
                           default=str, ensure_ascii=False)
    meta_data.save()
    return dict_data


def write_sign_to_contract(user, company, context):
    """
    Add sign by user to contract
    """
    user_path = get_user_folder_path(user)
    render_to_pdf(
        template_src=TYPE_OF_CONTARCT[f'{company.company_type}_{user.profile.type}'],
        context_dict=context,
        user_path=f'{user_path}/{company.code}/')


def generate_context_data(user, company, context_for_sign=None) -> dict:
    """
    Create data for contract 
    """
    context = {
        'number_of_contract': get_last_number_of_contract(company),
        'date': datetime.date.today().strftime("%d.%m.%Y"),
        'user': {
            'name': user.name,
            'surname': user.surname,
            'patronymic': user.patronymic,
            'phone': user.phone,
            'email': user.email,
            'profile': {
                'residence': user.profile.residence,
                'passport': user.profile.passport,
                'issued': user.profile.issued.strftime("%d.%m.%Y"),
                'ogrnip': user.profile.ogrnip,
                'issued_code': user.profile.issued_code,
                'place_of_issue': user.profile.place_of_issue,
                'inn': user.profile.inn,
                'dob': user.profile.dob.strftime("%d.%m.%Y"),
                'snils': user.profile.snils,
                'bankdetail': {
                    'cardholder': user.profile.bankdetail.cardholder_name,
                    'card': user.profile.bankdetail.card,
                    'ks': user.profile.bankdetail.ks,
                    'rs': user.profile.bankdetail.rs,
                    'bik': user.profile.bankdetail.bik,
                    'bank': user.profile.bankdetail.bank_info,
                },
            },
        },
        'company': {
            'full_name': company.full_name,
            'short_name': company.short_name,
            'owner': company.owner,
            'address': company.address,
            'inn': company.inn,
            'kpp': company.kpp,
            'ogrn': company.ogrn,
            'okpo': company.okpo,
            'rs': company.rs,
            'bik': company.bik,
            'bank': company.bank_info,
            'ks': company.ks
        },
        'sign': context_for_sign,
    }
    return context


def generate_context_data_for_sign(is_manager, manager_certificate, manager_created_at) -> dict:
    context = {
        'is_manager': is_manager,
        'uuid': uuid.uuid4(),
        'manager_datetime_sign': datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S'),
        'manager_certificate': manager_certificate,
        'manager_created_at': manager_created_at.astimezone(pytz.UTC).strftime('%Y-%m-%d %H:%M:%S'),
        'manager_expired_at': manager_created_at.replace(manager_created_at.year+1).astimezone(pytz.UTC).strftime('%Y-%m-%d %H:%M:%S'),
    }
    return context


def preview_contract_for_manager(company_user, context_body, context_for_sign=None):
    """
    Generate PDF for preview for manager
    """
    # Generate user's folder
    user_path = get_user_folder_path(company_user.user)
    company_user_folder = f'{user_path}/{company_user.company.code}'
    os.makedirs(os.path.dirname(
        f'{company_user_folder}/contract.pdf'), exist_ok=True)
    # generate context for contract
    context_data = generate_context_data(
        company_user.user, company_user.company, context_for_sign)
    # Create main context of data
    context = dict(context_data, **context_body)
    # Create new UserDocument and save .pdf file to filefield
    file = render_to_pdf(
        template_src=TYPE_OF_CONTARCT[f'{company_user.company.company_type}_{company_user.user.profile.type}'],
        context_dict=context,
        user_path=company_user_folder)
    return (file, context)


def create_CompanyUserDocument_model(company_user) -> str:
    """
    Create CompanyUserDocument model with contract.pdf file

    :return CompanyUserDocument model
    """
    contract = CompanyUserDocument.objects.create(
        company_document=company_user, title='Договор')
    hash = create_user_hash(company_user.user.created_at, company_user.user.open_code)
    contract.document.name = f'user_{hash}/{company_user.company.code}/contract.pdf'
    contract.save()
    return contract


def create_meta_data_for_contract(context, contract):
    document_uuid = context['sign'].get('uuid')
    json_data = json.dumps(context, indent=4, sort_keys=True,
                           default=str, ensure_ascii=False)
    model = MetaDataUserDocument.objects.create(
        document=contract,
        document_uuid=document_uuid,
        data=json_data,
    )
    model.save()


def create_contract_for_user(company_user, context, is_manager=None):
    """
    Create contract for user when Manager accept
    user's profile
    """
    context_for_sign = generate_context_data_for_sign(
        is_manager=is_manager,
        manager_certificate=context.pop('manager_certificate'),
        manager_created_at=context.pop('manager_created_at'),
    )
    # Create PDF contract
    file, context = preview_contract_for_manager(
        company_user, context, context_for_sign)
    if file:
        contract = create_CompanyUserDocument_model(company_user)
        create_meta_data_for_contract(context, contract)
        generate_email_with_contract(company_user, contract.document.path)
        # Change profile's flag contract = True
        # for protect to create new contract
        company_user.contract = True
        company_user.save()
        return True
    return None


def get_data_of_contract(company_user: CompanyUser):
    meta_data = company_user.documents.get(title='Договор').metadatauserdocument
    dict_data = json.loads(meta_data.data)
    return dict_data


def create_task_user_folder(task):
    user_path = get_user_folder_path(task.user.user)
    task_user_folder = f'{user_path}/{task.user.company.code}/{task.id}'
    os.makedirs(os.path.dirname(f'{task_user_folder}/'), exist_ok=True)
    return task_user_folder


def get_words_from_num(price):
    words = num2words(price, lang='ru')
    array_of_words = words.split('запятая')
    data = {
        "rub":array_of_words[0].capitalize(),
        "kop":array_of_words[1]
    }
    return data


def get_context_for_task(data, task, context_for_sign):
    data.pop('sign')
    context = {
        'number_of_task': get_last_number_of_task(task),
        'today': datetime.date.today().strftime("%d.%m.%Y"),
        'task':{
            'title':task.title,
            'descriprion':task.description,
            'from':task.from_date.strftime("%d.%m.%Y"),
            'to':task.to_date.strftime("%d.%m.%Y"),
            'price':"{:,.2f}".format(task.price),
            'price_in_words':get_words_from_num(task.price),
        },
        'sign': context_for_sign,
    }
    context |= data
    return context


def create_taskdocument_model(task, task_user_folder, context):
    json_data = json.dumps(context, indent=4, sort_keys=True,
                           default=str, ensure_ascii=False)
    number_of_task = context['number_of_task']
    document = TaskDocument.objects.create(
        task=task,
        title='Закрывающий документ',
        document_uuid=context['sign']['uuid'],
        meta_data=json_data,
    )
    document.file.name=f'{task_user_folder}/task_{number_of_task}.pdf'
    document.save()
    return document


def get_relative_path_of_user(task_user_folder):
    path = re.findall("user_(?:.*)", task_user_folder)[0]
    return path


def update_meta_data(document, user):
    dict_data = json.loads(document.meta_data)
    user_sign = {
        'is_user': True,
        'user_certificate': user.open_code,
        'user_created_at': user.created_at.astimezone(pytz.UTC).strftime('%Y-%m-%d %H:%M:%S'),
        'user_expired_at': user.created_at.replace(user.created_at.year+1).astimezone(pytz.UTC).strftime('%Y-%m-%d %H:%M:%S'),
        'user_datetime_sign': datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S'),
    }
    dict_data['sign'].update(user_sign)
    document.meta_data = json.dumps(dict_data, indent=4, sort_keys=True,
                           default=str, ensure_ascii=False)
    document.save()
    return dict_data


def write_sign_to_close_document_by_user(task, context):

    task_user_folder = create_task_user_folder(task)
    number_of_task = context['number_of_task']
    render_to_pdf(
        template_src='close_document.html',
        context_dict=context,
        user_path=task_user_folder,
        file_name=f'task_{number_of_task}')



def create_close_document_for_task(task, context):
    
    context_for_sign = generate_context_data_for_sign(
        is_manager=True,
        manager_certificate=context.get('manager_certificate'),
        manager_created_at=context.get('manager_created_at'),
    )
    
    dict_data = get_data_of_contract(task.user)
    task_user_folder = create_task_user_folder(task)
    context = get_context_for_task(dict_data, task, context_for_sign)
    
    number_of_task = context['number_of_task']
    
    file = render_to_pdf(
        template_src='close_document.html',
        context_dict=context,
        user_path=task_user_folder,
        file_name=f'task_{number_of_task}')

    path = get_relative_path_of_user(task_user_folder)

    if file:
        document = create_taskdocument_model(task, path, context)
        generate_email_with_close_document_of_task(task.user, document.file.path)
        task.is_completed = True
        task.save()

