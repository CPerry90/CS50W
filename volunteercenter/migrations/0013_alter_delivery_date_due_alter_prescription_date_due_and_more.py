# Generated by Django 4.1 on 2022-11-12 23:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('volunteercenter', '0012_alter_delivery_date_due_alter_prescription_date_due_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='delivery',
            name='date_due',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='prescription',
            name='date_due',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='welfare',
            name='date_due',
            field=models.DateField(blank=True, null=True),
        ),
    ]
