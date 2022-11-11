from django.contrib.auth.models import AbstractUser
from django.db import models
from phonenumber_field.modelfields import PhoneNumberField
from rest_framework import serializers

DEPARTMENT_CHOICES = (
    ('none', 'NONE'),
    ('delivery', 'DELIVERY'),
    ('prescription', 'PRESCRIPTION'),
    ('welfare', 'WELFARE'),
    ('taxi', 'TAXI')
)

USER_TYPE = (
    ('none', 'NONE'),
    ('client', 'CLIENT'),
    ('handler', 'HANDLER'),
    ('operator', 'OPERATOR')
)

STATUS = (
    ('recieved', 'RECIEVED'),
    ('processing', 'PROCESSING'),
    ('accepted', 'ACCEPTED'),
    ('fulfilled', 'FULFILLED')
)
#User model with user types and departments
class User(AbstractUser):
    user_type = models.CharField(max_length=20, choices=USER_TYPE, default='none')
    department = models.CharField(max_length=20, choices=DEPARTMENT_CHOICES, default='none')
    phone_number = PhoneNumberField(blank=True)
    address_1 = models.CharField(max_length=130, blank=True)
    address_2 = models.CharField(max_length=130, blank=True)
    city = models.CharField(max_length=130, blank=True)
    county = models.CharField(max_length=130, blank=True)
    postcode = models.CharField(max_length=130, blank=True)
    def seralize(self):
        return {
            "id": self.pk,
            "username": self.username,
            "email": self.email,
            "type": self.user_type,
            "phone": self.phone_number,
            "postcode": self.postcode
        }

#Operation Models

class Delivery(models.Model):
    delivery_client = models.ForeignKey(User, on_delete=models.CASCADE, related_name="delivery_client")
    order = models.TextField(blank=True, max_length=1000)
    date_created = models.DateTimeField(auto_now_add=True)
    date_due = models.DateTimeField()
    operator = models.ForeignKey(User, on_delete=models.CASCADE, related_name="delivery_operator")
    status = models.CharField(max_length=20, choices=STATUS, default='recieved')

class Prescription(models.Model):
    prescription_client = models.ForeignKey(User, on_delete=models.CASCADE, related_name="prescription_client")
    order_details = models.TextField(blank=True, max_length=1000)
    pharmacy = models.TextField(blank=True, max_length=1000)
    date_created = models.DateTimeField(auto_now_add=True)
    date_due = models.DateTimeField()
    operator = models.ForeignKey(User, on_delete=models.CASCADE, related_name="prescription_operator")
    status = models.CharField(max_length=20, choices=STATUS, default='recieved')

class Welfare(models.Model):
    welfare_client = models.ForeignKey(User, on_delete=models.CASCADE, related_name="welfare_client")
    notes = models.TextField(blank=True, max_length=1000)
    date_created = models.DateTimeField(auto_now_add=True)
    date_due = models.DateTimeField()
    operator = models.ForeignKey(User, on_delete=models.CASCADE, related_name="welfare_operator")
    status = models.CharField(max_length=20, choices=STATUS, default='recieved')
