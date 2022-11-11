# Generated by Django 4.1 on 2022-11-11 15:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('volunteercenter', '0005_rename_client_delivery_delivery_client_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='delivery',
            name='order_number',
            field=models.IntegerField(blank=True, default=123453, max_length=7),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='prescription',
            name='order_number',
            field=models.IntegerField(blank=True, default=12345, max_length=7),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='welfare',
            name='order_number',
            field=models.IntegerField(blank=True, default=12343, max_length=7),
            preserve_default=False,
        ),
    ]
