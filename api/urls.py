from django.urls import path

from . import views

urlpatterns = [
    path("client_search", views.user_search, name="user_search"),
    path("client_details/<int:id>", views.client_details, name="client_details"),
    path("order_details/<int:id>", views.order_details, name="client_details"),
    path("pdf/<int:order_number>", views.pdf, name="pdf"),
    path("new_order", views.new_order, name="new_order"),
    path("edit_client", views.editClient, name="edit_client"),
    path("order_update", views.order_update, name="order_update"),
    path("new_client", views.newClient, name="new_client"),
    path("user_details", views.user_details, name="user_details"),
    path("op_orders", views.op_orders, name="op_orders"),
    path("order_status", views.order_status, name="order_status"),
    path("delete_order", views.delete_order, name="delete_order"),
]
