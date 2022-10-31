from email.policy import default
from django.contrib.auth.models import AbstractUser
from django.db import models
import datetime


class User(AbstractUser):
    pass

class category(models.Model):
    categoryType = models.CharField(max_length=100)
    def __str__(self):
        return f"{self.categoryType}"

class bid(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True, related_name="bidUser")
    bid = models.DecimalField(max_digits=10, decimal_places=2)
    listing = models.CharField(max_length=64, blank=True, null=True)
    def __str__(self):
        return F"{self.bid}"

class listing(models.Model):
    title = models.CharField(max_length=64, blank=True, null=True)
    description = models.CharField(max_length=1000)
    imageURL = models.CharField(max_length=1000, blank=True, null=True)
    price = models.ForeignKey(bid, on_delete=models.CASCADE, blank=True, null=True, related_name="bidAmnt")
    owner = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True, related_name="user")
    category = models.ForeignKey(category, on_delete=models.CASCADE, blank=True, null=True, related_name="category")
    active = models.BooleanField(default=True)
    watchlist = models.ManyToManyField(User, blank=True, null=True, related_name="watchingUsers")


class comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True, related_name="commentUser")
    listing = models.ForeignKey(listing, on_delete=models.CASCADE, blank=True, null=True, related_name="commentListing")
    comment = models.CharField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"Comment on listing: {self.listing}, by {self.user} at {self.created_at}"


