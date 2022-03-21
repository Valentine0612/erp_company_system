from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal

from main.models import CompanyUser
from main.counters import STATE_OF_TASK, ISSUED
from main.validators import validate_file_extension
from main.helpers import create_user_hash, create_file_name


def create_task_document_directory_path(instance, filename):
    """
    Generate directory for task's document
    """
    hash = create_user_hash(
        instance.task.user.user.created_at,
        instance.task.user.user.open_code
    )
    file_name = create_file_name(instance.title, filename)
    task_id = instance.task.id
    company_code = instance.task.user.company.code
    return 'user_{0}/{1}/{2}/{3}'.format(hash, company_code, task_id, file_name)


class Task(models.Model):
    """
    Task model main object for creation task by Manager for Employee 
    """
    user = models.ForeignKey(CompanyUser, related_name='tasks', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price = models.DecimalField(decimal_places=2, max_digits=10, validators=[MinValueValidator(Decimal('0.00'))])
    from_date = models.DateField()
    to_date = models.DateField()
    is_completed = models.BooleanField(default=False)
    is_paid = models.BooleanField(default=False)
    is_signed = models.BooleanField(default=False)
    state = models.CharField(choices=STATE_OF_TASK, default=ISSUED, max_length=10)
    deal_id = models.UUIDField(null=True)
    step_id = models.UUIDField(null=True)

    def __str__(self) -> str:
        return f'{self.user} - {self.title}'

    class Meta:
        db_table = 'task'


class TaskDocument(models.Model):
    """
    Model with Many-to-One relation for Task model
    """
    task = models.ForeignKey(Task, related_name='documents', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    file = models.FileField(upload_to=create_task_document_directory_path,
                            validators=[validate_file_extension])
    document_uuid = models.UUIDField(unique=True, null=True, blank=True)
    meta_data = models.JSONField(default=dict, null=True, blank=True)

    def __str__(self) -> str:
        return self.title

    class Meta:
        db_table = 'task_document'
    
