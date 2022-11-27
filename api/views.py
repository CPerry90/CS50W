from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.shortcuts import render
from volunteercenter.serializers import (
    UserSerializer,
    deliverySerializer,
    prescriptionSerializer,
    welfareSerializer,
)
from volunteercenter.models import User, Delivery, Prescription, Welfare
import io
import json
from django.http import FileResponse
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from reportlab.platypus import Paragraph
from django.db import IntegrityError


@csrf_exempt
@login_required
def user_details(request):
    if request.user.is_authenticated:
        if request.method == "POST":
            data = json.loads(request.body)
            id = data.get("id", "")
            user = User.objects.get(pk=request.user.id)
            if id != "":
                user = User.objects.get(pk=id)
            else:
                user = User.objects.get(pk=request.user.id)
            serializer = UserSerializer(user)
            return JsonResponse({"user": serializer.data}, safe=False)
        else:
            return render(request, "volunteercenter/login.html")
    else:
        return render(request, "volunteercenter/login.html")


@csrf_exempt
@login_required
def user_search(request):
    clients = []
    if request.user.is_authenticated:
        if request.method == "POST":
            _clients = User.objects.filter(user_type="client")
            for client in _clients:
                serializer = UserSerializer(client)
                clients.append(serializer.data)
            return JsonResponse({"clients": clients}, safe=False)
        else:
            return render(request, "volunteercenter/login.html")
    else:
        return render(request, "volunteercenter/login.html")


@csrf_exempt
@login_required
def op_orders(request):
    recieved_open = []
    processing_open = []
    accepted_assigned = []
    fulfilled_assigned = []
    if request.user.is_authenticated:
        if request.method == "POST":
            if request.user.department == "delivery":
                _recieved_open = (
                    Delivery.objects.filter(status="recieved")
                    .exclude(operator=request.user.id)
                    .order_by("-date_created")
                )
                _processing_open = (
                    Delivery.objects.filter(status="processing")
                    .exclude(operator=request.user.id)
                    .order_by("-date_created")
                )
                _accepted_assigned = Delivery.objects.filter(
                    status="accepted", operator=request.user.id
                ).order_by("-date_created")
                _fulfilled_assigned = Delivery.objects.filter(
                    status="fulfilled", operator=request.user.id
                ).order_by("-date_created")
                for order in _fulfilled_assigned:
                    serializer = deliverySerializer(order)
                    fulfilled_assigned.append(serializer.data)
                for order in _accepted_assigned:
                    serializer = deliverySerializer(order)
                    accepted_assigned.append(serializer.data)
                for order in _recieved_open:
                    serializer = deliverySerializer(order)
                    recieved_open.append(serializer.data)
                for order in _processing_open:
                    serializer = deliverySerializer(order)
                    processing_open.append(serializer.data)
                return JsonResponse(
                    {
                        "recieved_open": recieved_open,
                        "processing_open": processing_open,
                        "accepted_assigned": accepted_assigned,
                        "fulfilled_assigned": fulfilled_assigned,
                    },
                    safe=False,
                )
            elif request.user.department == "prescription":
                _recieved_open = (
                    Prescription.objects.filter(status="recieved")
                    .exclude(operator=request.user.id)
                    .order_by("-date_created")
                )
                _processing_open = (
                    Prescription.objects.filter(status="processing")
                    .exclude(operator=request.user.id)
                    .order_by("-date_created")
                )
                _accepted_assigned = Prescription.objects.filter(
                    status="accepted", operator=request.user.id
                ).order_by("-date_created")
                _fulfilled_assigned = Prescription.objects.filter(
                    status="fulfilled", operator=request.user.id
                ).order_by("-date_created")
                for order in _fulfilled_assigned:
                    serializer = prescriptionSerializer(order)
                    fulfilled_assigned.append(serializer.data)
                for order in _accepted_assigned:
                    serializer = prescriptionSerializer(order)
                    accepted_assigned.append(serializer.data)
                for order in _recieved_open:
                    serializer = prescriptionSerializer(order)
                    recieved_open.append(serializer.data)
                for order in _processing_open:
                    serializer = prescriptionSerializer(order)
                    processing_open.append(serializer.data)
                return JsonResponse(
                    {
                        "recieved_open": recieved_open,
                        "processing_open": processing_open,
                        "accepted_assigned": accepted_assigned,
                        "fulfilled_assigned": fulfilled_assigned,
                    },
                    safe=False,
                )
            elif request.user.department == "welfare":
                _recieved_open = (
                    Welfare.objects.filter(status="recieved")
                    .exclude(operator=request.user.id)
                    .order_by("-date_created")
                )
                _processing_open = (
                    Welfare.objects.filter(status="processing")
                    .exclude(operator=request.user.id)
                    .order_by("-date_created")
                )
                _accepted_assigned = Welfare.objects.filter(
                    status="accepted", operator=request.user.id
                ).order_by("-date_created")
                _fulfilled_assigned = Welfare.objects.filter(
                    status="fulfilled", operator=request.user.id
                ).order_by("-date_created")
                for order in _fulfilled_assigned:
                    serializer = welfareSerializer(order)
                    fulfilled_assigned.append(serializer.data)
                for order in _accepted_assigned:
                    serializer = welfareSerializer(order)
                    accepted_assigned.append(serializer.data)
                for order in _recieved_open:
                    serializer = welfareSerializer(order)
                    recieved_open.append(serializer.data)
                for order in _processing_open:
                    serializer = welfareSerializer(order)
                    processing_open.append(serializer.data)
                return JsonResponse(
                    {
                        "recieved_open": recieved_open,
                        "processing_open": processing_open,
                        "accepted_assigned": accepted_assigned,
                        "fulfilled_assigned": fulfilled_assigned,
                    },
                    safe=False,
                )
        else:
            return render(request, "volunteercenter/login.html")
    else:
        return render(request, "volunteercenter/login.html")


@csrf_exempt
@login_required
def client_details(request, id):
    list = {}
    if request.user.is_authenticated:
        if request.method == "POST":
            if id == 0:
                client = request.user.id
            else:
                client = User.objects.get(pk=id)
            if Delivery.objects.filter(delivery_client=client).exists():
                deliveryObjs = (
                    Delivery.objects.filter(delivery_client=client)
                    .exclude(status="archived")
                    .order_by("-date_created")
                    .all()
                )
                delivery = []
                for _delivery in deliveryObjs:
                    _deliverySerializer = deliverySerializer(_delivery)
                    delivery.append(_deliverySerializer.data)
                list["delivery"] = delivery
            if Prescription.objects.filter(prescription_client=client).exists():
                prescObjs = (
                    Prescription.objects.filter(prescription_client=client)
                    .exclude(status="archived")
                    .order_by("-date_created")
                    .all()
                )
                prescription = []
                for _prescription in prescObjs:
                    _prescriptionSerializer = prescriptionSerializer(_prescription)
                    prescription.append(_prescriptionSerializer.data)
                list["prescription"] = prescription
            if Welfare.objects.filter(welfare_client=client).exists():
                welfareObjs = (
                    Welfare.objects.filter(welfare_client=client)
                    .exclude(status="archived")
                    .order_by("-date_created")
                    .all()
                )
                welfare = []
                for _welfare in welfareObjs:
                    _welfareSerializer = welfareSerializer(_welfare)
                    welfare.append(_welfareSerializer.data)
                list["welfare"] = welfare
            return JsonResponse({"data": list}, safe=False)
        else:
            return render(request, "volunteercenter/login.html")
    else:
        return render(request, "volunteercenter/login.html")


@csrf_exempt
@login_required
def order_details(request, id):
    if request.user.is_authenticated:
        if request.method == "POST":
            if Delivery.objects.filter(order_number=id).exists():
                details = Delivery.objects.get(order_number=id)
                if request.user.user_type == "operator":
                    if details.status == "recieved":
                        details.status = "processing"
                        details.save()
                client = User.objects.get(username=details.delivery_client)
                detailsSerializer = deliverySerializer(details)
                clientSerializer = UserSerializer(client)
                if User.objects.filter(username=details.operator).exists():
                    operator = User.objects.get(username=details.operator)
                    op = {
                        "username": str(operator.first_name + " " + operator.last_name)
                    }
                else:
                    op = {"username": "Awaiting Assignment"}
            if Prescription.objects.filter(order_number=id).exists():
                details = Prescription.objects.get(order_number=id)
                if request.user.user_type == "operator":
                    if details.status == "recieved":
                        details.status = "processing"
                        details.save()
                client = User.objects.get(username=details.prescription_client)
                detailsSerializer = prescriptionSerializer(details)
                clientSerializer = UserSerializer(client)
                if User.objects.filter(username=details.operator).exists():
                    operator = User.objects.get(username=details.operator)
                    op = {
                        "username": str(operator.first_name + " " + operator.last_name)
                    }
                else:
                    op = {"username": "Awaiting Assignment"}
            if Welfare.objects.filter(order_number=id).exists():
                details = Welfare.objects.get(order_number=id)
                if request.user.user_type == "operator":
                    if details.status == "recieved":
                        details.status = "processing"
                        details.save()
                client = User.objects.get(username=details.welfare_client)
                detailsSerializer = welfareSerializer(details)
                clientSerializer = UserSerializer(client)
                if User.objects.filter(username=details.operator).exists():
                    operator = User.objects.get(username=details.operator)
                    op = {
                        "username": str(operator.first_name + " " + operator.last_name)
                    }
                else:
                    op = {"username": "Awaiting Assignment"}
            return JsonResponse(
                {
                    "details": detailsSerializer.data,
                    "client": clientSerializer.data,
                    "operator": op,
                },
                safe=False,
            )
        else:
            return render(request, "volunteercenter/login.html")
    else:
        return render(request, "volunteercenter/login.html")


@csrf_exempt
@login_required
def order_status(request):
    if request.user.is_authenticated:
        if request.method == "POST":
            data = json.loads(request.body)
            id = data.get("id", "")
            detail = data.get("detail", "")
            if Delivery.objects.filter(order_number=id).exists():
                order = Delivery.objects.get(order_number=id)
                operator = User.objects.get(pk=request.user.id)
                order.operator = operator
                order.status = detail
                order.save()
            if Prescription.objects.filter(order_number=id).exists():
                order = Prescription.objects.get(order_number=id)
                operator = User.objects.get(pk=request.user.id)
                order.operator = operator
                order.status = detail
                order.save()
            if Welfare.objects.filter(order_number=id).exists():
                order = Welfare.objects.get(order_number=id)
                operator = User.objects.get(pk=request.user.id)
                order.operator = operator
                order.status = detail
                order.save()
            return JsonResponse({"message": detail}, safe=False)
        else:
            return render(request, "volunteercenter/login.html")
    else:
        return render(request, "volunteercenter/login.html")


@csrf_exempt
@login_required
def new_order(request):
    if request.user.is_authenticated:
        if request.method == "POST":
            data = json.loads(request.body)
            type = data.get("type", "")
            client = data.get("client", "")
            client_Obj = User.objects.get(pk=client)
            details = data.get("details", "")
            date = data.get("date", "")
            if type == "delivery":
                delivery = Delivery(
                    delivery_client=client_Obj, order=details, date_due=date
                )
                delivery.save()
                return JsonResponse({"message": "Post sent successfully"}, status=201)
            if type == "prescription":
                pharm = data.get("pharm", "")
                presc = Prescription(
                    prescription_client=client_Obj,
                    order_details=details,
                    pharmacy=pharm,
                    date_due=date,
                )
                presc.save()
                return JsonResponse({"message": "Post sent successfully"}, status=201)
            if type == "welfare":
                welfare = Welfare(
                    welfare_client=client_Obj, notes=details, date_due=date
                )
                welfare.save()
                return JsonResponse({"message": "Post sent successfully"}, status=201)
        else:
            return render(request, "volunteercenter/login.html")
    else:
        return render(request, "volunteercenter/login.html")


@csrf_exempt
@login_required
def newClient(request):
    if request.user.is_authenticated:
        if request.method == "POST":
            data = json.loads(request.body)
            username = data.get("email", "")
            first_name = data.get("first_name", "")
            last_name = data.get("last_name", "")
            email = data.get("email", "")
            phone_number = data.get("phone_number", "")
            address_1 = data.get("address_1", "")
            address_2 = data.get("address_2", "")
            city = data.get("city", "")
            county = data.get("county", "")
            postcode = data.get("postcode", "").upper()
            password = data.get("password", "")

            try:
                user = User.objects.create_user(username, email, password)
                user.first_name = first_name
                user.last_name = last_name
                user.phone_number = phone_number
                user.address_1 = address_1
                user.address_2 = address_2
                user.city = city
                user.county = county
                user.postcode = postcode
                user.user_type = "client"
                user.save()
            except IntegrityError as e:
                print(e)
                return render(
                    request,
                    "volunteercenter/register.html",
                    {"message": "Username address already taken."},
                )
            serializer = UserSerializer(user)
            return JsonResponse(
                {"message": "Saved", "client": serializer.data, "password": password},
                status=201,
            )
        else:
            return render(request, "volunteercenter/login.html")
    else:
        return render(request, "volunteercenter/login.html")


@csrf_exempt
@login_required
def editClient(request):
    if request.user.is_authenticated:
        if request.method == "POST":
            data = json.loads(request.body)
            id = data.get("id", "")
            clientToEdit = User.objects.get(pk=id)
            clientToEdit.first_name = data.get("first_name", "")
            clientToEdit.last_name = data.get("last_name", "")
            clientToEdit.email = data.get("email", "")
            clientToEdit.phone_number = data.get("phone_number", "")
            clientToEdit.address_1 = data.get("address_1", "")
            clientToEdit.address_2 = data.get("address_2", "")
            clientToEdit.city = data.get("city", "")
            clientToEdit.county = data.get("county", "")
            clientToEdit.postcode = data.get("postcode", "")
            clientToEdit.save()
            serializer = UserSerializer(clientToEdit)
            return JsonResponse(
                {"message": "Saved", "client": serializer.data}, status=201
            )
        else:
            return render(request, "volunteercenter/login.html")
    else:
        return render(request, "volunteercenter/login.html")


@csrf_exempt
@login_required
def order_update(request):
    if request.user.is_authenticated:
        if request.method == "POST":
            data = json.loads(request.body)
            id = data.get("order", "")
            if Delivery.objects.filter(order_number=id).exists():
                order = Delivery.objects.get(order_number=id)
                order.order = data.get("content", "")
                order.date_due = data.get("date", "")
                order.save()
                return JsonResponse(
                    {"message": "Saved", "new_content": data.get("content", "")},
                    status=201,
                )
            if Prescription.objects.filter(order_number=id).exists():
                order = Prescription.objects.get(order_number=id)
                order.order_details = data.get("content", "")
                order.date_due = data.get("date", "")
                order.pharmacy = data.get("pharmacy", "")
                order.save()
                return JsonResponse(
                    {"message": "Saved", "new_content": data.get("content", "")},
                    status=201,
                )
            if Welfare.objects.filter(order_number=id).exists():
                order = Welfare.objects.get(order_number=id)
                order.notes = data.get("content", "")
                order.date_due = data.get("date", "")
                order.save()
                return JsonResponse(
                    {"message": "Saved", "new_content": data.get("content", "")},
                    status=201,
                )
        else:
            return render(request, "volunteercenter/login.html")
    else:
        return render(request, "volunteercenter/login.html")


@csrf_exempt
@login_required
def delete_order(request):
    if request.user.is_authenticated:
        if request.method == "POST":
            data = json.loads(request.body)
            order_id = data.get("id", "")
            if Delivery.objects.filter(order_number=order_id).exists():
                order = Delivery.objects.get(order_number=order_id)
                order.status = "archived"
                order.save()
            if Prescription.objects.filter(order_number=order_id).exists():
                order = Prescription.objects.get(order_number=order_id)
                order.status = "archived"
                order.save()
            if Welfare.objects.filter(order_number=order_id).exists():
                order = Welfare.objects.get(order_number=order_id)
                order.status = "archived"
                order.save()
            return JsonResponse({"message": "Deleted"}, safe=False)
        else:
            return render(request, "volunteercenter/login.html")
    else:
        return render(request, "volunteercenter/login.html")


@csrf_exempt
@login_required
def pdf(request, order_number):
    buffer = io.BytesIO()
    p = canvas.Canvas(buffer)
    assigned = "Awaiting Assignment"
    phone = ""
    if Delivery.objects.filter(order_number=order_number).exists():
        details = Delivery.objects.get(order_number=order_number)
        created_at = details.date_created.strftime("%d %B, %Y")
        due_at = details.date_due.strftime("%d %B, %Y")
        client = User.objects.get(username=details.delivery_client)
        if User.objects.filter(username=details.operator).exists():
            operator = User.objects.get(username=details.operator)
            assigned = f"{operator.first_name} {operator.last_name}"
            phone = operator.phone_number
        body = details.order
        other = ""
    elif Prescription.objects.filter(order_number=order_number).exists():
        details = Prescription.objects.get(order_number=order_number)
        created_at = details.date_created.strftime("%d %B, %Y")
        due_at = details.date_due.strftime("%d %B, %Y")
        client = User.objects.get(username=details.prescription_client)
        if User.objects.filter(username=details.operator).exists():
            operator = User.objects.get(username=details.operator)
            assigned = f"{operator.first_name} {operator.last_name}"
            phone = operator.phone_number
        body = details.order_details
        other = str("Pharmacy: " + details.pharmacy)
    elif Welfare.objects.filter(order_number=order_number).exists():
        details = Welfare.objects.get(order_number=order_number)
        created_at = details.date_created.strftime("%d %B, %Y")
        due_at = details.date_due.strftime("%d %B, %Y")
        client = User.objects.get(username=details.welfare_client)
        if User.objects.filter(username=details.operator).exists():
            operator = User.objects.get(username=details.operator)
            assigned = f"{operator.first_name} {operator.last_name}"
            phone = operator.phone_number
        body = details.notes
        other = ""
    logo = ImageReader("./volunteercenter/static/logo.png")
    p.drawImage(logo, 400, 600, width=120, preserveAspectRatio=True, mask="auto")
    p.drawString(50, 790, f"Request no. {order_number}")
    p.drawString(50, 755, f"{client.last_name}, {client.first_name}")
    p.drawString(50, 740, f"{client.address_1}")
    if client.address_2 != "":
        p.drawString(50, 725, f"{client.address_2}")
        p.drawString(50, 710, f"{client.city}")
        p.drawString(50, 695, f"{client.county}")
        p.drawString(50, 680, f"{client.postcode}")
        p.drawString(50, 665, f"{client.email}")
        p.drawString(50, 650, f"{client.phone_number}")
    else:
        p.drawString(50, 725, f"{client.city}")
        p.drawString(50, 710, f"{client.county}")
        p.drawString(50, 695, f"{client.postcode}")
        p.drawString(50, 680, f"{client.email}")
        p.drawString(50, 665, f"{client.phone_number}")
    topLine = [(50, 650, 540, 650)]
    p.lines(topLine)
    p.drawString(50, 620, str("Order Details"))
    p.drawString(50, 595, str(other))
    paragraph = Paragraph(f"{body}")
    paragraph.wrapOn(p, 800, 600)
    paragraph.drawOn(p, 50, 575)
    botLine = [(50, 100, 540, 100)]
    p.drawString(50, 80, f"Created: {created_at}")
    p.drawString(50, 65, f"Due on: {due_at}")
    p.drawString(50, 50, f"Assigned to: {assigned}")
    p.drawString(50, 35, f"Phone: {phone}")
    p.drawString(400, 80, f"Status: {details.status.capitalize()}")
    p.lines(botLine)
    p.showPage()
    p.save()
    buffer.seek(0)
    return FileResponse(
        buffer, as_attachment=True, filename=f"Order-{order_number}.pdf"
    )
