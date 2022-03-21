# Generated by Django 3.2.8 on 2022-02-05 10:37

from decimal import Decimal
import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0006_alter_taskdocument_meta_data'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='price',
            field=models.DecimalField(decimal_places=2, max_digits=10, validators=[django.core.validators.MinValueValidator(Decimal('0.00'))]),
        ),
    ]
