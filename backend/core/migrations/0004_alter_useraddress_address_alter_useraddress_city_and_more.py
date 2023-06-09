# Generated by Django 4.2.1 on 2023-06-28 10:38

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_useraddress'),
    ]

    operations = [
        migrations.AlterField(
            model_name='useraddress',
            name='address',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='useraddress',
            name='city',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='useraddress',
            name='post_code',
            field=models.CharField(max_length=6, null=True),
        ),
        migrations.AlterField(
            model_name='useraddress',
            name='user',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
