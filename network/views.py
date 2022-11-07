from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.core.paginator import Paginator
from django.urls import reverse
import json
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse

from .models import User, Post, UserSerializer

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

#Get all posts depeneding on view (home, following, or user)
def posts(request, view, page):
    if request.user.is_authenticated:
        loggedIn = True
    else:
        loggedIn = False
    #Selecting which posts to view
    if view == "home":
        posts = Post.objects.all()

    elif view == "following":
        user = User.objects.get(username=request.user)
        userFollowing = user.following.all()
        posts = Post.objects.filter(user__in=set(userFollowing))
    else:
        posts = Post.objects.filter(user=view)
    #Order the posts, and paginate them
    posts = posts.order_by("-timestamp").all()
    paginator = Paginator(posts, 10)
    page_obj = paginator.get_page(page)
    num_pages = paginator.num_pages

    return JsonResponse({ 
        "loggedIn": loggedIn, 
        "view": view, 
        "num_pages": num_pages, 
        "cur_pages": page, 
        "posts": [post.serialize() for post in page_obj],
        }, safe=False)

#Look up profile information
@csrf_exempt
def profile_view(request, lookupUser):
        if request.user.is_authenticated:
            loggedIn = True
        else:
            loggedIn = False
        profile = User.objects.get(pk=lookupUser)
        profile_followers = User.objects.filter(following=lookupUser)
        if profile_followers:
            for f in profile_followers:
                if str(f.username) == str(request.user):
                    isFollowing = True
                else:
                    isFollowing = False
        else:
            isFollowing = False
        if str(request.user) == str(profile.username):
            notownProfile = False
        else:
            notownProfile = True
            
        serializer = UserSerializer(profile_followers, many=True)
        return JsonResponse({
                    "loggedIn": loggedIn, 
                    "id": profile.pk,
                    "notownProfile": notownProfile,
                    "username": profile.username,
                    "followers": profile_followers.count(),
                    "following": profile.following.count(),
                    "isFollowing": isFollowing,
                    "method": request.method
                    })

@csrf_exempt
@login_required
#Update following status and count
def updateFollowing(request):
    if request.method == "POST":
        data = json.loads(request.body)
        current_userId = data.get("currentUser", "")
        target_userId = data.get("targetUser", "")
        current_user = User.objects.get(pk=current_userId)
        target_user = User.objects.get(username=target_userId)
        profile_followers = User.objects.filter(following=target_user)
        
        if profile_followers.filter(username=current_user).exists():
            current_user.following.remove(target_user)
            msg = 0
        else:
            current_user.following.add(target_user)
            msg = 1

        return JsonResponse({
            "status" : msg,
            "following": target_user.following.count(),
            "followers": profile_followers.count(),
            })
    else:
        return HttpResponseRedirect(reverse("index"))

@csrf_exempt
@login_required
def post_udpate(request, post_id):
    if request.method == "PUT":
        data = json.loads(request.body)
        new_content = data.get("content", "")
        if new_content == "":
            return JsonResponse({"msg": "Not Allowed"})
        post = Post.objects.get(pk=post_id)

        if (request.user == post.user):
            post.content = new_content
            post.save()
            return JsonResponse({"new_content" : new_content, "msg": "Saved."})
        else:
            return JsonResponse({"new_content" : post.content, "msg": "You do not have permission."})
    else:
        return HttpResponseRedirect(reverse("index"))


@csrf_exempt
@login_required
def like_post(request, post_id):
    if request.method == "PUT":
        user = User.objects.get(username=request.user)
        post = Post.objects.get(pk=post_id)
        likes = post.likes.all()
        if likes.filter(username=user):
            post.likes.remove(user)
        else:
            post.likes.add(user)

        new_like_count = Post.objects.get(pk=post_id).likes.count()

        return JsonResponse({"like_count" : new_like_count})
    else:
        return HttpResponseRedirect(reverse("index"))
    