# Generated by Django 3.2.8 on 2022-02-28 11:59

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0007_alter_company_okpo'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bankdetail',
            name='rs',
            field=models.CharField(blank=True, max_length=22, validators=[django.core.validators.RegexValidator(regex='^(\\d{20}|\\d{22})$')]),
        ),
        migrations.AlterField(
            model_name='company',
            name='rs',
            field=models.CharField(max_length=22, validators=[django.core.validators.RegexValidator(regex='^(\\d{20}|\\d{22})$')]),
        ),
    ]
