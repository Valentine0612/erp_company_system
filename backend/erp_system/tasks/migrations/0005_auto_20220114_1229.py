# Generated by Django 3.2.8 on 2022-01-14 09:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0004_task_price'),
    ]

    operations = [
        migrations.AddField(
            model_name='taskdocument',
            name='document_uuid',
            field=models.UUIDField(blank=True, null=True, unique=True),
        ),
        migrations.AddField(
            model_name='taskdocument',
            name='meta_data',
            field=models.JSONField(default=dict, null=True),
        ),
    ]
