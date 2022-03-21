from main.models import Company

from .api_urls import (
    create_beneficiare, 
    create_bank_details_for_beneficiare,
    create_deal,
    create_step_in_deal,
    add_deponent_to_step_in_deal,
    add_recipient_to_step_in_deal,
    identify_transactions
)
from .services import (
    modify_data_for_beneficiare, 
    modify_data_for_bankDetails_of_beneficiar,
    modify_data_for_deal,
    modify_data_for_step,
    modify_amount_to_json,
    modify_data_for_recipient,
    modify_data_for_idetify_transaction,
    modify_data_for_system,
    modify_data_for_company_recipient
)


def get_beneficiare_id(validated_data, meta_data=None):
    """
    Return beneficiareId for created Beneficiare
    """
    beneficiar_json_data = modify_data_for_beneficiare(validated_data, meta_data)
    return create_beneficiare(beneficiar_json_data)


def get_bankDetails_id(validated_data, beneficiary_id):
    """
    Return bankDetailsId for created Beneficiare
    """
    bank_detail_beneficiare = modify_data_for_bankDetails_of_beneficiar(validated_data)
    return create_bank_details_for_beneficiare(bank_detail_beneficiare, beneficiary_id)


def create_deal_with_step(company, amount):
    """
    Creation deal and step for financial transactions

    return deal_id and step_id
    """
    # create deal
    json_deal_data = modify_data_for_deal()
    deal_id = create_deal(json_deal_data)['dealId']

    # create step
    json_step_data = modify_data_for_step(company, deal_id)
    step_id = create_step_in_deal(json_step_data, deal_id)['stepId']

    # add beneficiary as deponent
    data = modify_amount_to_json(float(amount))
    add_deponent_to_step_in_deal(deal_id, step_id, company.beneficiary_id, data)

    context = {
        'deal_id': deal_id,
        'step_id': step_id
    }
    return context


def add_recipient(task, user):
    """
    Add recipient to step in deal
    """
    # add worker as recipient
    data = modify_data_for_recipient(task, user)
    add_recipient_to_step_in_deal(task.deal_id, task.step_id, data)

    # add system company as recipient for commission of system
    company_data = modify_data_for_system(task)
    add_recipient_to_step_in_deal(task.deal_id, task.step_id, company_data)


def identify_transaction(transaction):
    """
    Identify incoming transaction for beneficiary
    """
    inn = transaction['payerInn']
    beneficiary = Company.objects.get(inn=inn)
    json_data = modify_data_for_idetify_transaction(transaction, beneficiary.beneficiary_id)
    identify_transactions(transaction['operationId'], json_data)


def add_company_recipient(company, receipt_data):
    data = modify_data_for_company_recipient(company.total_price)
    add_recipient_to_step_in_deal(receipt_data['deal_id'], receipt_data['step_id'], data)
