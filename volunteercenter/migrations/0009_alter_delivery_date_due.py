# Generated by Django 4.1 on 2022-11-12 13:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('volunteercenter', '0008_alter_delivery_operator'),
    ]

    operations = [
        migrations.AlterField(
            model_name='delivery',
            name='date_due',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
