from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    following = models.ManyToManyField("self", blank=True, null=True, related_name="followers", symmetrical=False)
    def seralize(self):
        return {
            "username": self.username,
            "following": self.following.count()
        }
    pass

class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    content = models.TextField(blank=True, max_length=300)
    likes = models.ManyToManyField(User, blank=True, null=True, related_name="likes")
    timestamp = models.DateTimeField(auto_now_add=True)
    def serialize(self):
        return {
            "id": self.user.id,
            "user": self.user.username,
            "content": self.content,
            "likes": self.likes.count(),
            "timestamp": self.timestamp
        }