from dadata import Dadata
from django.conf import settings


def get_bank_info_form_bik(bik: str) -> str:
    """
    With Dadata service get valid Bain info form BIK value
    """

    with Dadata(settings.DADATA_API_KEY, settings.DADATA_SECRET_KEY) as dadata:
        # result is list
        result = dadata.find_by_id(name="bank", query=bik)

    if result:
        # get first element from list
        data = result[0]
        return data['unrestricted_value']
    return 'BIK is not valid'
