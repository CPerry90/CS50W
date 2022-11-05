from django.contrib import admin
from .models import User, Post

# Register your models here.
class postsAdmin(admin.ModelAdmin):
    filter_horizontal = ("likes",)

class userAdmin(admin.ModelAdmin):
    filter_horizontal = ("following",)

admin.site.register(User, userAdmin)
admin.site.register(Post, postsAdmin)