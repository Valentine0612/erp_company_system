from erp_system.celery import app


from main.models import Company
from tinkoff_api.api_urls import (
    get_current_balance, 
    accept_deal,
    complete_deal
)
from tinkoff_api.utils import create_deal_with_step, add_company_recipient
from .utils import (
    create_receipt_model, 
    save_final_price, 
    interact_with_managers,
    save_receipt_data,
    clear_total_price_field,
    remove_empty_folders
)


@app.task
def update_billing_system():
    """
    update billing data every month
    """
    companies = Company.objects.all()
    for company in companies:
        # save total receipt to Company model
        save_final_price(company)
        create_receipt_model(company)


@app.task
def create_deals_and_steps():
    """
    create deal for each company
    where deponent - company
    recipient - system company
    """
    companies = Company.objects.all()
    for company in companies:
        # create deal and step for company
        receipt_data = create_deal_with_step(company, company.total_price)
        save_receipt_data(company, receipt_data)
        add_company_recipient(company, receipt_data)
        accept_deal(receipt_data['deal_id'])

        # check if company have enought money on balance for payment
        # get current balance for beneficiary
        balance_data = get_current_balance(company.beneficiary_id)
        if balance_data['amount'] < company.total_price:
            # block managers
            interact_with_managers(company, True)
        else:
            complete_deal(receipt_data['deal_id'], receipt_data['step_id'])
            clear_total_price_field(company)


@app.task
def retry_billing_payment():
    """
    for company in which manager is_banned = True
    retry to provide their payment and set is_banned = False
    """
    companies = Company.objects.filter(total_price__gt=0)
    for company in companies:
        deal_id, step_id = company.receipt_data.split()
        balance_data = get_current_balance(company.beneficiary_id)
        if balance_data['amount'] >= company.total_price:
            complete_deal(deal_id, step_id)
            clear_total_price_field(company)
            # unlock managers
            interact_with_managers(company, False)


@app.task
def clear_empty_folder():
    """
    every month clear empty folders in MEDIA_ROOT
    """
    remove_empty_folders()


