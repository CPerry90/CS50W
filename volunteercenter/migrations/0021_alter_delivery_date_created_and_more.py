# Generated by Django 4.1 on 2022-11-26 10:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('volunteercenter', '0020_remove_user_token_det_remove_user_token_use'),
    ]

    operations = [
        migrations.AlterField(
            model_name='delivery',
            name='date_created',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='prescription',
            name='date_created',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='welfare',
            name='date_created',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]
