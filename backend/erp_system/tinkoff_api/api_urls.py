import uuid
import requests
from django.conf import settings

MAIN_URL = settings.TINKOFF_API_URL
headers = {
    'Authorization' : settings.TINKOFF_API_TOKEN,
    'Content-type' : 'application/json',
    'Idempotency-Key': uuid.uuid4(),
}

def call_tinkoff_api(url, data=None):
    response = requests.post(url=MAIN_URL+url, headers=headers, data=data)
    return response


def create_beneficiare(data):
    url = '/api/v1/nominal-accounts/beneficiaries/'
    try:
        response = call_tinkoff_api(url, data)
        response.raise_for_status()
        data = {'beneficiary_id': response.json()['beneficiaryId']}
    except requests.exceptions.HTTPError:
        data = response.json()
    return data


def create_bank_details_for_beneficiare(data, beneficiary_id):
    url = f'/api/v1/nominal-accounts/beneficiaries/{beneficiary_id}/bank-details'
    try:
        response = call_tinkoff_api(url, data)
        response.raise_for_status()
        data = {'bankDetails_id': response.json()['bankDetailsId']} 
    except requests.exceptions.HTTPError:
        data = response.json()
    return data


def create_deal(data):
    url = '/api/v1/nominal-accounts/deals'
    response = call_tinkoff_api(url, data)
    return response.json()


def create_step_in_deal(data, deal_id):
    url = f'/api/v1/nominal-accounts/deals/{deal_id}/steps'
    response = call_tinkoff_api(url, data)
    return response.json()


def add_deponent_to_step_in_deal(deal_id, step_id, beneficiary_id, data):
    url = f'/api/v1/nominal-accounts/deals/{deal_id}/steps/{step_id}/deponents/{beneficiary_id}'
    response = requests.put(url=MAIN_URL+url, headers=headers, data=data)
    return response.json()


def add_recipient_to_step_in_deal(deal_id, step_id, data):
    url = f'/api/v1/nominal-accounts/deals/{deal_id}/steps/{step_id}/recipients'
    response = call_tinkoff_api(url, data)
    return response.json()


def accept_deal(deal_id):
    url = f'/api/v1/nominal-accounts/deals/{deal_id}/accept'
    response = call_tinkoff_api(url)
    return response.json()


# call every 1 hour via Celery
def get_unindentified_transactions():
    url = f'/api/v1/nominal-accounts/incoming-transactions/?accountNumber={settings.TINKOFF_NOMINAL_ACCOUNT}'
    response = requests.get(url=MAIN_URL+url, headers=headers)
    return response.json()['results']


# call every 1 hour via Celery
def identify_transactions(operation_id, data):
    url = f'/api/v1/nominal-accounts/incoming-transactions/{operation_id}/identify'
    response = call_tinkoff_api(url, data)
    return response.json()


def get_status_of_step(deal_id, step_id):
    """
    checking state of step in deal
    """
    url = f'/api/v1/nominal-accounts/deals/{deal_id}/steps/{step_id}'
    response = requests.get(url=MAIN_URL+url, headers=headers)
    if response.status_code == 200:
        return response.json()['status']
    return None


def complete_deal(deal_id, step_id):
    url = f'/api/v1/nominal-accounts/deals/{deal_id}/steps/{step_id}/complete'
    response = call_tinkoff_api(url)
    return response.json()


def get_current_balance(beneficiary_id):
    """
    return current balance by beneficiary_id
    """
    url = f'/api/v1/nominal-accounts/virtual-accounts/balances'
    params = {
        'accountNumber': settings.TINKOFF_NOMINAL_ACCOUNT,
        'beneficiaryId': beneficiary_id
    }
    response = requests.get(url=MAIN_URL+url, headers=headers, params=params)
    if response.status_code == 200:
        return response.json()['results'][0]
    return None
