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
    inlines = [
        UserDeliveryInline,
        UserPrescriptionInline,
        UserWelfareInline
        ]

admin.site.register(User, UserAdmin)
admin.site.register(Delivery)
admin.site.register(Prescription)
admin.site.register(Welfare)

