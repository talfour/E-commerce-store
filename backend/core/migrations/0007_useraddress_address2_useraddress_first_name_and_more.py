# Generated by Django 4.2.1 on 2023-06-29 12:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0006_remove_user_address_useraddress_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='useraddress',
            name='address2',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='useraddress',
            name='first_name',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='useraddress',
            name='last_name',
            field=models.CharField(max_length=100, null=True),
        ),
    ]
