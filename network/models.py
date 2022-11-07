from django.contrib.auth.models import AbstractUser
from django.db import models
from rest_framework import serializers

class User(AbstractUser):
    following = models.ManyToManyField("self", blank=True, null=True, related_name="followers", symmetrical=False)
    def seralize(self):
        return {
            "id": self.pk,
            "username": self.username,
            "following": self.following.count()
        }

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("username", "id")

class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    content = models.TextField(blank=True, max_length=300)
    likes = models.ManyToManyField(User, blank=True, null=True, related_name="_likes")
    timestamp = models.DateTimeField(auto_now_add=True)
    def serialize(self):
        return {
            "post_id": self.pk,
            "id": self.user.id,
            "user": self.user.username,
            "content": self.content,
            "likes": self.likes.count(),
            "liked_by": UserSerializer(self.likes,many=True).data,
            "timestamp": self.timestamp.strftime("%d %b %Y, %I:%M %p")
        }


