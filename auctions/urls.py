from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("createListing", views.createListing, name="createListing"),
    path("viewListing/<int:id>", views.viewListing, name="viewListing"),
    path("addToWatchlist/<int:id>", views.addToWatchlist, name="addToWatchlist"),
    path("removeFromWatchlist/<int:id>", views.removeFromWatchlist, name="removeFromWatchlist"),
    path("removeFromWatchlistPage/<int:id>", views.removeFromWatchlistPage, name="removeFromWatchlistPage"),
    path("viewWatchlist", views.viewWatchlist, name="viewWatchlist"),
    path("addComment/<int:id>", views.addComment, name="addComment"),
    path("addBid/<int:id>", views.addBid, name="addBid"),
    path("closeAuction/<int:id>", views.closeAuction, name="closeAuction"),
    path("categorySelect", views.categorySelect, name="categorySelect"),
    path("myListings", views.myListings, name="myListings"),
    path("viewBidding", views.viewBidding, name="viewBidding"),
]
