import json
from django.conf import settings


TYPE_OF_PAYMENTS = {
    'PD': 'PAYMENT_DETAILS'
}

def remove_characters(str):
    """
    For Tinkoff API need SNILS format ^\{d11}$
    """
    new_str = str.replace('-','').replace(' ','')
    return new_str


def ul_serializer(data):
    """
    Serializer for UL_RESIDENT company
    """
    return {
        'type': 'UL_RESIDENT',
        'name': data['full_name'],
        'phoneNumber': data['phone'],
        'email': data['email'],
        'inn': data['inn'],
        'ogrn': data['ogrn'],
        'addresses': [{
                'type': 'LEGAL_ENTITY_ADDRESS',
                'address': data['address']
    }]}


def main_serializer(data, meta_data):
    return {
        "firstName": data['name'],
        "middleName": data['patronymic'],
        "lastName": data['surname'],
        "birthDate": meta_data['dob'],
        "birthPlace": meta_data['pob'],
        "phoneNumber": data['phone'],
        "email": data['email'],
        "documents": [{
            "type": "PASSPORT",
            "serial": meta_data['passport'].split()[0],
            "number": meta_data['passport'].split()[1],
            "date": meta_data['issued'],
            "organization": meta_data['place_of_issue'],
            "division": meta_data['issued_code']
        }],
        "addresses": [{
            "type": "REGISTRATION_ADDRESS",
            "address": meta_data['residence']
        }],
        "inn": meta_data['inn'],
    }


def ip_serializer(data, meta_data):
    """
    Serializer for IP_RESIDENT
    """
    owner = data.get('owner',None)
    if owner:
        data['name'] = owner.split()[1]
        data['patronymic'] = owner.split()[2] if len(owner.split()) > 2 else 'отсутствует'
        data['surname'] = owner.split()[0]
    context = main_serializer(data, meta_data)
    context['type'] = 'IP_RESIDENT'
    context['registrationDate'] = meta_data['registration_date']
    context['ogrn'] = meta_data['ogrnip']
    return context


def fl_serializer(data, meta_data):
    """
    Serializer for FL_RESIDENT
    """
    context = main_serializer(data, meta_data)
    context['type'] = 'FL_RESIDENT'
    context['isSelfEmployed'] = True if meta_data['type'] == 'SE' else False
    context['snils'] = remove_characters(meta_data['snils'])
    return context


def modify_data_for_beneficiare(data, meta_data=None):
    """
    modify data for creation company beneficiar in Tinkoff bank
    """
    match meta_data.get('type'):
        case 'LLC':
            context = ul_serializer(data)
        case 'SP':
            context = ip_serializer(data, meta_data)
        case 'NP'|'SE':
            context = fl_serializer(data, meta_data)
    return json.dumps(context)


def modify_data_for_bankDetails_of_beneficiar(data):
    """
    modify data for creation Bank Details data 
    of beneficiar in Tinkoff bank
    """
    context = {
        'type':TYPE_OF_PAYMENTS['PD'],
        'bik':data['bik'],
        'bankName':data['bank_info'],
        'accountNumber':data['rs'],
        'corrAccountNumber':data['ks'],
        'isDefault':True
    }
    return json.dumps(context)


def modify_data_for_deal():
    """
    modify data in json for creation Deal in Tinkoff API
    """
    context = {
        "accountNumber": settings.TINKOFF_NOMINAL_ACCOUNT
    }
    return json.dumps(context)


def modify_data_for_step(company, deal_id):
    """
    modify data in json for creation Step in Tinkoff API
    """
    msg = f'Этап сделки {deal_id} для компании {company.full_name}'
    context = {
        "description": msg
    }
    return json.dumps(context)


def modify_amount_to_json(amount):
    context = {
        "amount":amount
    }
    return json.dumps(context)


def modify_data_for_recipient(task, user):
    """
    create context data for recipient
    """
    context = {
        "beneficiaryId": str(user.profile.beneficiary_id),
        "amount": float(task.price),
        "purpose": "Оплата за проделанные услуги. НДС не облагаeтся",
        "bankDetailsId": str(user.profile.bankDetails_id),
        "keepOnVirtualAccount": False
    }
    return json.dumps(context)


def modify_data_for_system(task):
    """
    modify data for company as recipient for commission
    """
    context = {
        "beneficiaryId": settings.BENEFICIARY_ID,
        "amount": float(task.price)*settings.SYSTEM_COMMISSION,
        "purpose": "Коммиссия Сервиса. НДС не облагается",
        "bankDetailsId": settings.BANKDETAILS_ID,
        "keepOnVirtualAccount": False
    }
    return json.dumps(context)


def modify_data_for_idetify_transaction(transaction, beneficiary_id):
    context = {
        "amountDistribution": [{
            "beneficiaryId": str(beneficiary_id),
            "amount": transaction['amount']
    }]}
    return json.dumps(context)


def modify_data_for_company_recipient(total_price):
    """
    create context data for company recipient
    """
    context = {
        "beneficiaryId": settings.BENEFICIARY_ID,
        "amount": float(total_price),
        "purpose": "Оплата пользование сервиса. НДС не облагаeтся",
        "bankDetailsId": settings.BANKDETAILS_ID,
        "keepOnVirtualAccount": False
    }
    return json.dumps(context)
