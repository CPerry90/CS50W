
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("new_post", views.new_post, name="new_post"),
    path("posts/<str:view>/<int:page>", views.posts, name="posts"),
    path("profile/<int:lookupUser>", views.profile_view, name="profile_view"),
    path("updateFollowing", views.updateFollowing, name="updateFollowing"),
    path("post_update/<int:post_id>", views.post_udpate, name="post_update"),
    path("like_post/<int:post_id>", views.like_post, name="like_post"),
]
