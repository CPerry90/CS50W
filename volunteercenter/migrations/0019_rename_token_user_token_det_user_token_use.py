# Generated by Django 4.1 on 2022-11-24 15:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('volunteercenter', '0018_alter_delivery_order_number_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='user',
            old_name='token',
            new_name='token_det',
        ),
        migrations.AddField(
            model_name='user',
            name='token_use',
            field=models.IntegerField(default=0),
        ),
    ]
