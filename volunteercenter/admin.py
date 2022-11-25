from django.contrib import admin
from .models import User, Delivery, Prescription, Welfare


class UserDeliveryInline(admin.TabularInline):
    model = Delivery
    fk_name = "delivery_client"
    extra = 0


class UserPrescriptionInline(admin.TabularInline):
    model = Prescription
    fk_name = "prescription_client"
    extra = 0


class UserWelfareInline(admin.TabularInline):
    model = Welfare
    fk_name = "welfare_client"
    extra = 0


class UserAdmin(admin.ModelAdmin):
    list_display = ["first_name", "last_name", "email", "user_type", "department"]
    inlines = [UserDeliveryInline, UserPrescriptionInline, UserWelfareInline]


class DeliveryAdmin(admin.ModelAdmin):
    list_display = [
        "order_number",
        "delivery_client",
        "date_created",
        "date_due",
        "status",
        "operator",
    ]


class PrescriptionAdmin(admin.ModelAdmin):
    list_display = [
        "order_number",
        "prescription_client",
        "date_created",
        "date_due",
        "status",
        "operator",
    ]


class WelfareAdmin(admin.ModelAdmin):
    list_display = [
        "order_number",
        "welfare_client",
        "date_created",
        "date_due",
        "status",
        "operator",
    ]


admin.site.register(User, UserAdmin)
admin.site.register(Delivery, DeliveryAdmin)
admin.site.register(Prescription, PrescriptionAdmin)
admin.site.register(Welfare, WelfareAdmin)
