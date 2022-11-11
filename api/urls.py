from django.urls import path
from . import views

urlpatterns = [
    path("client_search", views.user_search, name="user_search"),
    path("client_details/<int:id>", views.client_details, name="client_details"),
]