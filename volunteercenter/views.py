from django.shortcuts import HttpResponseRedirect, render
from django.urls import reverse
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from .models import User

# Create your views here.
def index(request):
    if request.user.is_authenticated:
        if request.user.user_type == "handler":
            return HttpResponseRedirect(reverse("call_handler_index"))
        elif request.user.user_type == "operator":
            return HttpResponseRedirect(reverse("operator_index"))
        else:
            return render(request, "volunteercenter/index.html")
    else:
        return HttpResponseRedirect(reverse("login"))


def call_handler_index(request):
    if request.user.is_authenticated:
        return render(request, "volunteercenter/callhandler.html")
    else:
        return HttpResponseRedirect(reverse("login"))


def operator_index(request):
    if request.user.is_authenticated:
        return render(request, "volunteercenter/operator.html")
    else:
        return HttpResponseRedirect(reverse("login"))


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"].lower()
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(
                request,
                "volunteercenter/login.html",
                {"message": "Invalid email and/or password."},
            )
    else:
        return render(request, "volunteercenter/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["email"].lower()
        firstName = request.POST["first_name"]
        lastName = request.POST["last_name"]
        email = request.POST["email"]
        phoneNumber = request.POST["phone_number"]
        address_1 = request.POST["address_1"]
        address_2 = request.POST["address_2"]
        city = request.POST["city"]
        county = request.POST["county"]
        posctode = request.POST["postcode"].upper()
        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(
                request,
                "volunteercenter/register.html",
                {"message": "Passwords must match."},
            )

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.first_name = firstName
            user.last_name = lastName
            user.phone_number = phoneNumber
            user.address_1 = address_1
            user.address_2 = address_2
            user.city = city
            user.county = county
            user.postcode = posctode
            user.user_type = "client"
            user.save()
        except IntegrityError as e:
            print(e)
            return render(
                request,
                "volunteercenter/register.html",
                {"message": "Username address already taken."},
            )
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "volunteercenter/register.html")
