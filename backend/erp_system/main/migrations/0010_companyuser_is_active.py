# Generated by Django 3.2.8 on 2022-03-13 20:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0009_user_is_banned'),
    ]

    operations = [
        migrations.AddField(
            model_name='companyuser',
            name='is_active',
            field=models.BooleanField(default=False),
        ),
    ]
