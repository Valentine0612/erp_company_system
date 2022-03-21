import os
from datetime import datetime
from calendar import monthrange
from xmlrpc.client import boolean
from django.conf import settings

from .models import Receipt


def get_last_day_of_month(date_value):
    return date_value.replace(day = monthrange(date_value.year, date_value.month)[1])


def create_data_for_receipt_model(company, date):
    """
    return dict of data for creation model Receipt
    """
    return {
        'company':company,
        'from_period':date,
        'to_period':get_last_day_of_month(datetime.today().date())
    }


def create_receipt_model(company):
    dict_data = create_data_for_receipt_model(company, datetime.today().date())
    Receipt.objects.create(**dict_data)


def increase_active_worker(company):
    latest_receipt = company.receipts.all().last()
    latest_receipt.active_workers += 1
    latest_receipt.save()


def save_final_price(company):
    """
    Calculating and saving total_price of current model
    """
    latest_receipt = company.receipts.all().last()
    price = latest_receipt.active_workers*settings.AMOUNT_PER_WORKER
    if price:
        company.total_price = price
    else:
        company.total_price = settings.AMOUNT_PER_MONTH
    company.save()


def interact_with_managers(company, value: boolean):
    managers = company.user.filter(is_manager=True)
    for manager in managers:
        manager.is_banned = value
        manager.save()


def save_receipt_data(company, receipt_data):
    company.receipt_data = f'{receipt_data["deal_id"]} {receipt_data["step_id"]}'
    company.save()


def clear_total_price_field(company):
    company.total_price = 0
    company.save()


def remove_empty_folders():
    path_abs = settings.MEDIA_ROOT
    walk = list(os.walk(path_abs))
    for path, _, _ in walk[::-1]:
        if len(os.listdir(path)) == 0:
            os.rmdir(path)
