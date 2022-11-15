from django.contrib.auth.models import AbstractUser
from django.db import models
from random import randrange


def generate_order_number():
    while True:
        code = randrange(10000, 20000)
        if (
            Delivery.objects.filter(order_number=code).count() == 0
            and Prescription.objects.filter(order_number=code).count() == 0
            and Welfare.objects.filter(order_number=code).count() == 0
        ):
            break
    return code


DEPARTMENT_CHOICES = (
    ("none", "NONE"),
    ("delivery", "DELIVERY"),
    ("prescription", "PRESCRIPTION"),
    ("welfare", "WELFARE"),
)

USER_TYPE = (
    ("none", "NONE"),
    ("client", "CLIENT"),
    ("handler", "HANDLER"),
    ("operator", "OPERATOR"),
)

STATUS = (
    ("recieved", "RECIEVED"),
    ("processing", "PROCESSING"),
    ("accepted", "ACCEPTED"),
    ("fulfilled", "FULFILLED"),
)
# User model with user types and departments
class User(AbstractUser):
    user_type = models.CharField(max_length=20, choices=USER_TYPE, default="none")
    department = models.CharField(
        max_length=20, choices=DEPARTMENT_CHOICES, default="none"
    )
    phone_number = models.CharField(max_length=12, blank=True)
    address_1 = models.CharField(max_length=130, blank=True)
    address_2 = models.CharField(max_length=130, blank=True)
    city = models.CharField(max_length=130, blank=True)
    county = models.CharField(max_length=130, blank=True)
    postcode = models.CharField(max_length=130, blank=True)

    def __str__(self):
        return f"{self.username}"


# Operation Models


class Delivery(models.Model):
    order_number = models.IntegerField(
        max_length=7, default=generate_order_number, blank=True
    )
    delivery_client = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="delivery_client"
    )
    order = models.TextField(blank=True, max_length=1000)
    date_created = models.DateTimeField(auto_now_add=True)
    date_due = models.DateField(blank=True, null=True)
    operator = models.ForeignKey(
        User,
        blank=True,
        null=True,
        on_delete=models.CASCADE,
        related_name="delivery_operator",
    )
    status = models.CharField(max_length=20, choices=STATUS, default="recieved")

    def serialize(self):
        return {"date_created": self.date_created.strftime("%d %B, %Y")}


class Prescription(models.Model):
    order_number = models.IntegerField(
        max_length=7, default=generate_order_number, blank=True
    )
    prescription_client = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="prescription_client"
    )
    order_details = models.TextField(blank=True, max_length=1000)
    pharmacy = models.TextField(blank=True, max_length=1000)
    date_created = models.DateTimeField(auto_now_add=True)
    date_due = models.DateField(blank=True, null=True)
    operator = models.ForeignKey(
        User,
        blank=True,
        null=True,
        on_delete=models.CASCADE,
        related_name="prescription_operator",
    )
    status = models.CharField(max_length=20, choices=STATUS, default="recieved")


class Welfare(models.Model):
    order_number = models.IntegerField(
        max_length=7, default=generate_order_number, blank=True
    )
    welfare_client = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="welfare_client"
    )
    notes = models.TextField(blank=True, max_length=1000)
    date_created = models.DateTimeField(auto_now_add=True)
    date_due = models.DateField(blank=True, null=True)
    operator = models.ForeignKey(
        User,
        blank=True,
        null=True,
        on_delete=models.CASCADE,
        related_name="welfare_operator",
    )
    status = models.CharField(max_length=20, choices=STATUS, default="recieved")
