from rest_framework import serializers
from .models import User, Delivery, Prescription, Welfare


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "first_name",
            "last_name",
            "user_type",
            "department",
            "email",
            "phone_number",
            "address_1",
            "address_2",
            "city",
            "county",
            "postcode",
        )


class deliverySerializer(serializers.ModelSerializer):
    delivery_client = UserSerializer()
    operator = UserSerializer()

    class Meta:
        model = Delivery
        fields = (
            "id",
            "order_number",
            "order",
            "date_created",
            "date_due",
            "status",
            "operator",
            "delivery_client",
        )


class prescriptionSerializer(serializers.ModelSerializer):
    prescription_client = UserSerializer()
    operator = UserSerializer()

    class Meta:
        model = Prescription
        fields = (
            "id",
            "order_number",
            "order_details",
            "pharmacy",
            "date_created",
            "date_due",
            "status",
            "operator",
            "prescription_client",
        )


class welfareSerializer(serializers.ModelSerializer):
    welfare_client = UserSerializer()
    operator = UserSerializer()

    class Meta:
        model = Welfare
        fields = (
            "id",
            "order_number",
            "notes",
            "date_created",
            "date_due",
            "status",
            "operator",
            "welfare_client",
        )
