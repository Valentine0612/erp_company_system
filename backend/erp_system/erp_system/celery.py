import os
from celery import Celery
 
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'erp_system.settings')
 
app = Celery('erp_system')
app.config_from_object('django.conf:settings')
 
app.autodiscover_tasks()
