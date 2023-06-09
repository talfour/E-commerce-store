# Generated by Django 4.2.1 on 2023-07-04 12:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0011_alter_order_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='orderitem',
            name='cost',
            field=models.DecimalField(blank=True, decimal_places=2, default=0, max_digits=10),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='category',
            name='name',
            field=models.CharField(max_length=125, verbose_name='Product Category'),
        ),
    ]
