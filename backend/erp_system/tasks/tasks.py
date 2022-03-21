from erp_system.celery import app


from tinkoff_api.api_urls import get_unindentified_transactions
from tinkoff_api.utils import identify_transaction


@app.task
def call_to_api_every_hour():
    """
    Call to Tinkoff API every 1 hour 
    for identify new transaction
    """
    unidentified_transactions = get_unindentified_transactions()
    for transaction in unidentified_transactions:
        identify_transaction(transaction)
