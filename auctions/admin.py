from django.contrib import admin
from .models import User, category, listing, comment, bid
# Register your models here.

class listingAdmin(admin.ModelAdmin):
    filter_horizontal = ("watchlist",)
    list_display = ('title', 'price', 'owner', 'category', 'active')

class bidAdmin(admin.ModelAdmin):
    list_display = ('user', 'bid', 'listing',)

admin.site.register(User)
admin.site.register(category)
admin.site.register(listing, listingAdmin)
admin.site.register(comment)
admin.site.register(bid, bidAdmin)

