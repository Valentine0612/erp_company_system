from django.db import models
from django.core.validators import MinValueValidator

from main.models import Company


class Receipt(models.Model):
    """
    Model for storage info about
    count of payments each month
    """
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='receipts')
    from_period = models.DateField()
    to_period = models.DateField()
    active_workers = models.IntegerField(default=0, validators=[MinValueValidator(0)])

    def __str__(self) -> str:
        return self.company.full_name

    class Meta:
        db_table = 'receipt'

