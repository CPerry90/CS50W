from django.contrib.auth.models import AbstractUser
from django.db import models


def generate_order_number():
    order_number_list = [0]
    highest = 0
    deliveries = Delivery.objects.all()
    prescriptions = Prescription.objects.all()
    welfares = Welfare.objects.all()
    for order in deliveries:
        order_number_list.append(order.order_number)
    for order in prescriptions:
        order_number_list.append(order.order_number)
    for order in welfares:
        order_number_list.append(order.order_number)
    order_number_list.sort()
    highest = order_number_list[-1]

    return highest + 1


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
    ("archived", "ARCHIVED"),
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

    def seralize(self):
        return {
            "id": self.pk,
            "first_name": self.first_name,
            "last_name": self.last_name,
        }


# Operation Models


class Delivery(models.Model):
    order_number = models.IntegerField(default=generate_order_number, blank=True)
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
    order_number = models.IntegerField(default=generate_order_number, blank=True)
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
    order_number = models.IntegerField(default=generate_order_number, blank=True)
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
