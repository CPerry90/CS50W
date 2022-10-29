from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("wiki/<str:title>",views.get_page, name="title"),
    path("search_results/", views.page_search, name="page_search"),
    path("create_new_page/", views.create_new_page, name="create_new_page"),
    path("add_entry/", views.add_entry, name="add_entry"),
    path("save_edit/", views.save_edit, name="save_edit"),
    path("edit_entry/<str:title>", views.edit_entry, name="edit_entry"),
    path("random/", views.random, name="random"),
]
