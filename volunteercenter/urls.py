from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("callhandler", views.call_handler_index, name="call_handler_index"),
    path("operator", views.operator_index, name="operator_index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("client", views.index)
]