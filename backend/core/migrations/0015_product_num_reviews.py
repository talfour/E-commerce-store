# Generated by Django 4.2.1 on 2023-07-07 08:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0014_review'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='num_reviews',
            field=models.IntegerField(blank=True, default=0, null=True),
        ),
    ]
