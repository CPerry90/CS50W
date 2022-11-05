from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
import json
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.core import serializers

from .models import User, Post


def index(request):
    return render(request, "network/index.html")
    


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
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


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
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

#CRSF Exeomt, Login required
@csrf_exempt
@login_required
def new_post(request):
    #Method must be post
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    #Get the data
    data = json.loads(request.body)
    _user = data.get("user", "")
    _content = data.get("content", "")
    #Use the user data to get user object for m2m field
    user = User.objects.get(pk=_user)
    #Create Post object
    post = Post(
        user = user,
        content = _content,
    )
    #Save post
    post.save()
    #Json Response
    return JsonResponse({"message": "Post sent successfully"}, status=201)


def posts(request, user):
    if user == "home":
        posts = Post.objects.all()
        posts = posts.order_by("-timestamp").all()
    
    return JsonResponse([post.serialize() for post in posts], safe=False)

@csrf_exempt
@login_required
def profile_view(request, user):
    _user = User.objects.get(pk=user)
    followers = User.objects.filter(following=user).count()
    username = _user.username
    following = _user.following.count()
    user_posts = Post.objects.filter(user=user)

    #if request.method == "POST":
    return render(request, "network/profile.html", {
                "username": username,
                "followers": followers,
                "following": following,
                "user_posts": user_posts
    })
