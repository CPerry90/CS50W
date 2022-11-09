# Generated by Django 4.1 on 2022-11-09 12:22

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('volunteercenter', '0003_user_user_type'),
    ]

    operations = [
        migrations.CreateModel(
            name='Welfare',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('notes', models.TextField(blank=True, max_length=1000)),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('date_due', models.DateTimeField()),
                ('status', models.CharField(choices=[('recieved', 'RECIEVED'), ('processing', 'PROCESSING'), ('accepted', 'ACCEPTED'), ('fulfilled', 'FULFILLED')], default='recieved', max_length=20)),
                ('client', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='welfare_client', to=settings.AUTH_USER_MODEL)),
                ('operator', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='welfare_operator', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Prescription',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order_details', models.TextField(blank=True, max_length=1000)),
                ('pharmacy', models.TextField(blank=True, max_length=1000)),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('date_due', models.DateTimeField()),
                ('status', models.CharField(choices=[('recieved', 'RECIEVED'), ('processing', 'PROCESSING'), ('accepted', 'ACCEPTED'), ('fulfilled', 'FULFILLED')], default='recieved', max_length=20)),
                ('client', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='prescription_client', to=settings.AUTH_USER_MODEL)),
                ('operator', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='prescription_operator', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Delivery',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order', models.TextField(blank=True, max_length=1000)),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('date_due', models.DateTimeField()),
                ('status', models.CharField(choices=[('recieved', 'RECIEVED'), ('processing', 'PROCESSING'), ('accepted', 'ACCEPTED'), ('fulfilled', 'FULFILLED')], default='recieved', max_length=20)),
                ('client', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='delivery_client', to=settings.AUTH_USER_MODEL)),
                ('operator', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='delivery_operator', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]