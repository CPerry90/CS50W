from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from .forms import newListingForm, commentForm, bidForm

from .models import User, listing, category, comment, bid


def index(request):
    currentListings = listing.objects.filter(active=True)
    categories = category.objects.all()
    return render(request, "auctions/index.html", {
        "currentListings": currentListings,
        "categories": categories
    })

def categorySelect(request):
    if request.method == "POST":
        selectCategory = request.POST['category']
        if selectCategory == "all":
            currentListings = listing.objects.filter(active=True)
            allCategories = category.objects.all()
            return render(request, "auctions/index.html", {
                "currentListings": currentListings,
                "categories": allCategories
            })
        else:
            listingCategory = category.objects.get(categoryType=selectCategory)
            currentListings = listing.objects.filter(active=True, category=listingCategory)
            allCategories = category.objects.all()
            return render(request, "auctions/index.html", {
                "currentListings": currentListings,
                "categories": allCategories,
                "selectedCategory": selectCategory
            })


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "auctions/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "auctions/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "auctions/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "auctions/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "auctions/register.html")

def createListing(request):
    if request.method == "POST":
        form = newListingForm(request.POST)
        if form.is_valid():
            listingName = form.cleaned_data["title"]
            bidToAdd = bid(
                user = request.user,
                bid = form.cleaned_data["price"],
                listing = listingName
            )
            bidToAdd.save()
            addListing = listing(
                title = listingName,
                description = form.cleaned_data["description"],
                imageURL = form.cleaned_data["url"],
                price = bidToAdd,
                category = form.cleaned_data["category"],
                owner = request.user
            )
            addListing.save()
        else:
            return render(request, "auctions/createListing.html", {
            "message": "Form is invalid",
            "form": newListingForm
        })

        return HttpResponseRedirect(reverse(index))

    else:
        return render(request, "auctions/createListing.html", {
            "form": newListingForm
        })

def viewListing(request, id):
    viewListing = listing.objects.get(pk=id)
    userIsWatching = request.user in viewListing.watchlist.all()
    listingComments = comment.objects.filter(listing=viewListing)
    currentBids = bid.objects.filter(listing=viewListing).order_by('-bid')
    highestBid = currentBids.first()
    if request.user == viewListing.owner:
        isOwner = True
    else:
        isOwner = False
        
    if highestBid.user == request.user:
        highestBidder = True
    else:
        highestBidder = False
    return render(request, "auctions/listing.html", {
        "listing": viewListing,
        "isWatching": userIsWatching,
        "commentForm": commentForm,
        "comments": listingComments,
        "bidForm": bidForm,
        "isOwner": isOwner,
        "isActive": viewListing.active,
        "highestBidder": highestBidder
    })

def addToWatchlist(request, id):
    user = request.user
    thisListing = listing.objects.get(pk=id)
    thisListing.watchlist.add(user)
    return HttpResponseRedirect(reverse("viewListing", args=(id,)))

def removeFromWatchlist(request, id):
    user = request.user
    thisListing = listing.objects.get(pk=id)
    thisListing.watchlist.remove(user)
    return HttpResponseRedirect(reverse("viewListing", args=(id,)))

def removeFromWatchlistPage(request, id):
    user = request.user
    thisListing = listing.objects.get(pk=id)
    thisListing.watchlist.remove(user)
    watchedListings = user.watchingUsers.all()
    return render(request, "auctions/userWatchlist.html", {
        "watchedListings": watchedListings
    })

def viewWatchlist(request):
    user = request.user
    watchedListings = user.watchingUsers.all()
    return render(request, "auctions/userWatchlist.html", {
        "watchedListings": watchedListings
    })

def addComment(request, id):
    user = request.user
    commentListing = listing.objects.get(pk=id)
    if request.method == "POST":
        form = commentForm(request.POST)
        if form.is_valid():
            addComment = comment(
                user = user,
                listing = commentListing,
                comment = form.cleaned_data["comment"],
            )
    addComment.save()
    return HttpResponseRedirect(reverse("viewListing", args=(id,)))

def addBid(request, id):
    user = request.user
    currentListing = listing.objects.get(pk=id)
    currentBids = bid.objects.filter(listing=currentListing).order_by('-bid')
    highestBid = currentBids.first()
    if highestBid.user == request.user:
        highestBidder = True
    else:
        highestBidder = False
    userIsWatching = request.user in currentListing.watchlist.all()
    listingComments = comment.objects.filter(listing=currentListing)
    if request.method == "POST":
        form = bidForm(request.POST)
        if form.is_valid():
            newBidAmount = form.cleaned_data["bidAmount"]
            if newBidAmount > currentListing.price.bid:
                newBid = bid(user=user, bid=newBidAmount, listing=currentListing)
                newBid.save()
                currentListing.price = newBid
                currentListing.save()  
                currentBids = bid.objects.filter(listing=currentListing).order_by('-bid')
                highestBid = currentBids.first()
                if highestBid.user == request.user:
                    highestBidder = True
                else:
                    highestBidder = False
                return render(request, "auctions/listing.html", {
                    "listing": currentListing,
                    "isWatching": userIsWatching,
                    "commentForm": commentForm,
                    "comments": listingComments,
                    "bidForm": bidForm,
                    "isActive": currentListing.active,
                    "message": "Bid Success!",
                    "highestBidder": highestBidder
                })
            else:
                return render(request, "auctions/listing.html", {
                    "listing": currentListing,
                    "isWatching": userIsWatching,
                    "commentForm": commentForm,
                    "comments": listingComments,
                    "bidForm": bidForm,
                    "isActive": currentListing.active,
                    "message": "Bid failed!",
                    "highestBidder": highestBidder
                })

def closeAuction(request, id):
    user = request.user
    currentListing = listing.objects.get(pk=id)
    userIsWatching = request.user in currentListing.watchlist.all()
    listingComments = comment.objects.filter(listing=currentListing)
    currentBids = bid.objects.filter(listing=currentListing).order_by('-bid')
    highestBid = currentBids.first()
    if highestBid.user == request.user:
        highestBidder = True
    else:
        highestBidder = False

    if user == currentListing.owner:
        currentListing.active = False
        currentListing.save()
        return render(request, "auctions/listing.html", {
            "listing": currentListing,
            "isWatching": userIsWatching,
            "commentForm": commentForm,
            "comments": listingComments,
            "bidForm": bidForm,
            "message": "You have closed the Auction!",
            "highestBidder": highestBidder
        })        
    else:
        return render(request, "auctions/listing.html", {
            "listing": currentListing,
            "isWatching": userIsWatching,
            "commentForm": commentForm,
            "comments": listingComments,
            "bidForm": bidForm,
            "message": "Only the owner can close the auction.",
            "highestBidder": highestBidder
        })


