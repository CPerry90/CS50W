from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("client_search", views.user_search, name="user_search"),
    path("client_details/<int:id>", views.client_details, name="client_details"),
]