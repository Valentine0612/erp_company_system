# Generated by Django 3.2.8 on 2022-03-19 17:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0009_alter_task_from_date'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='is_signed',
            field=models.BooleanField(default=False),
        ),
    ]
