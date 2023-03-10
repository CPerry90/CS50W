# Generated by Django 4.1 on 2022-11-23 13:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('volunteercenter', '0013_alter_delivery_date_due_alter_prescription_date_due_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='delivery',
            name='date_created',
            field=models.DateField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='prescription',
            name='date_created',
            field=models.DateField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='department',
            field=models.CharField(choices=[('none', 'NONE'), ('delivery', 'DELIVERY'), ('prescription', 'PRESCRIPTION'), ('welfare', 'WELFARE')], default='none', max_length=20),
        ),
        migrations.AlterField(
            model_name='welfare',
            name='date_created',
            field=models.DateField(auto_now_add=True),
        ),
    ]
