from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.shortcuts import HttpResponse, HttpResponseRedirect, render
from volunteercenter.serializers import UserSerializer, deliverySerializer, prescriptionSerializer, welfareSerializer
from volunteercenter.models import User, Delivery, Prescription, Welfare
import io
import json
from django.http import FileResponse
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph

@csrf_exempt
@login_required
def user_search(request):
    clients = []
    if request.user.is_authenticated:
        if request.method == "POST":
            data = json.loads(request.body)
            token = data.get("token", "")
            if token == "1234":
                _clients = User.objects.filter(user_type="client")
                for client in _clients:
                    serializer = UserSerializer(client)
                    clients.append(serializer.data)
                return JsonResponse({
                    "clients": clients
                }, safe=False)
            else:
                return render(request, "volunteercenter/login.html")
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
            data = json.loads(request.body)
            token = data.get("token", "")
            if token == "1234":
                client = User.objects.get(pk=id)
                if Delivery.objects.filter(delivery_client=client).exists():
                    deliveryObjs = Delivery.objects.filter(delivery_client=client).order_by("-date_created").all()
                    delivery = []
                    for _delivery in deliveryObjs:
                        _deliverySerializer = deliverySerializer(_delivery)
                        delivery.append(_deliverySerializer.data)
                    list["delivery"] = delivery
                if Prescription.objects.filter(prescription_client=client).exists():
                    prescObjs = Prescription.objects.filter(prescription_client=client).order_by("-date_created").all()
                    prescription = []
                    for _prescription in prescObjs:
                        _prescriptionSerializer = prescriptionSerializer(_prescription)
                        prescription.append(_prescriptionSerializer.data)
                    list["prescription"] = prescription
                if Welfare.objects.filter(welfare_client=client).exists():
                    welfareObjs = Welfare.objects.filter(welfare_client=client).order_by("-date_created").all()
                    welfare = []
                    for _welfare in welfareObjs:
                        _welfareSerializer = welfareSerializer(_welfare)
                        welfare.append(_welfareSerializer.data)
                    list["welfare"] = welfare
                return JsonResponse({
                    "data": list
                }, safe=False)
            else:
                return render(request, "volunteercenter/login.html")
        else:
            return render(request, "volunteercenter/login.html")
    else:
        return render(request, "volunteercenter/login.html")

@csrf_exempt
@login_required
def order_details(request, id):
    if request.user.is_authenticated:
        if request.method == "POST":
            data = json.loads(request.body)
            token = data.get("token", "")
            if token == "1234":
                if Delivery.objects.filter(order_number=id).exists():
                    details = Delivery.objects.get(order_number=id)
                    client = User.objects.get(username=details.delivery_client)
                    detailsSerializer = deliverySerializer(details)
                    clientSerializer = UserSerializer(client)
                    if User.objects.filter(username=details.operator).exists():
                        operator = User.objects.get(username=details.operator)
                        operatorSerializer = UserSerializer(operator)
                        op = operatorSerializer.data
                    else:
                        op = {"username": "Awaiting Assignment"}
                if Prescription.objects.filter(order_number=id).exists():
                    details = Prescription.objects.get(order_number=id)
                    client = User.objects.get(username=details.prescription_client)
                    detailsSerializer = prescriptionSerializer(details)
                    clientSerializer = UserSerializer(client)
                    if User.objects.filter(username=details.operator).exists():
                        operator = User.objects.get(username=details.operator)
                        operatorSerializer = UserSerializer(operator)
                        op = operatorSerializer.data
                    else:
                        op = {"username": "Awaiting Assignment"}
                if Welfare.objects.filter(order_number=id).exists():
                    details = Welfare.objects.get(order_number=id)
                    client = User.objects.get(username=details.welfare_client)
                    detailsSerializer = welfareSerializer(details)
                    clientSerializer = UserSerializer(client)
                    if User.objects.filter(username=details.operator).exists():
                        operator = User.objects.get(username=details.operator)
                        operatorSerializer = UserSerializer(operator)
                        op = operatorSerializer.data
                    else:
                        op = {"username": "Awaiting Assignment"}
                return  JsonResponse({
                    "details": detailsSerializer.data,
                    "client": clientSerializer.data,
                    "operator": op
                }, safe=False)
            else:
                return render(request, "volunteercenter/login.html")
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
            token = data.get("token", "")
            if token == "1234":
                type = data.get("type", "")
                client = data.get("client", "")
                client_Obj = User.objects.get(pk=client)
                details = data.get("details", "")
                if type == "delivery":
                    delivery = Delivery(
                        delivery_client = client_Obj,
                        order = details,
                    )
                    delivery.save()
                    return JsonResponse({"message": "Post sent successfully"}, status=201)
                if type == "prescription":
                    pharm = data.get("pharm", "")
                    presc = Prescription(
                        prescription_client = client_Obj,
                        order_details = details,
                        pharmacy = pharm
                    )
                    presc.save()
                    return JsonResponse({"message": "Post sent successfully"}, status=201)
                if type == "welfare":
                    welfare = Welfare(
                        welfare_client = client_Obj,
                        notes = details,
                    )
                    welfare.save()
                    return JsonResponse({"message": "Post sent successfully"}, status=201)
            else:
                return render(request, "volunteercenter/login.html")
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
            token = data.get("token", "")
            if token == "1234":
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
                return JsonResponse({
                    "message": "Saved", 
                    "client": serializer.data}, 
                    status=201)
            else:
                return render(request, "volunteercenter/login.html")
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
            token = data.get("token", "")
            if token == "1234":
                id = data.get("order", "")
                if Delivery.objects.filter(order_number=id).exists():
                    order = Delivery.objects.get(order_number=id)
                    order.order = data.get("content", "")
                    order.save()
                    return JsonResponse({"message": "Saved", "new_content": data.get("content", "")}, status=201)
                if Prescription.objects.filter(order_number=id).exists():
                    order = Prescription.objects.get(order_number=id)
                    order.order_details = data.get("content", "")
                    order.save()
                    return JsonResponse({"message": "Saved", "new_content": data.get("content", "")}, status=201)
                if Welfare.objects.filter(order_number=id).exists():
                    order = Welfare.objects.get(order_number=id)
                    order.notes = data.get("content", "")
                    order.save()
                    return JsonResponse({"message": "Saved", "new_content": data.get("content", "")}, status=201)
            else:
                return render(request, "volunteercenter/login.html")
        else:
            return render(request, "volunteercenter/login.html")
    else:
        return render(request, "volunteercenter/login.html")




@csrf_exempt
@login_required
def pdf(request, order_number):
    buffer = io.BytesIO()
    p = canvas.Canvas(buffer)
    if Delivery.objects.filter(order_number=order_number).exists():
        details = Delivery.objects.get(order_number=order_number)
        created_at = details.date_created.strftime("%d %b %Y, %I:%M %p")
        due_at = details.date_due.strftime("%d %b %Y")
        client = User.objects.get(username=details.delivery_client)
        body = details.order
        other = ""
    elif Prescription.objects.filter(order_number=order_number).exists():
        details = Prescription.objects.get(order_number=order_number)
        created_at = details.date_created.strftime("%d %b %Y, %I:%M %p")
        due_at = details.date_due.strftime("%d %b %Y")
        client = User.objects.get(username=details.prescription_client)
        body = details.order_details
        other = str("Pharmacy: " + details.pharmacy)
    elif Welfare.objects.filter(order_number=order_number).exists():
        details = Welfare.objects.get(order_number=order_number)
        created_at = details.date_created.strftime("%d %b %Y, %I:%M %p")
        due_at = details.date_due.strftime("%d %b %Y")
        client = User.objects.get(username=details.welfare_client)
        body = details.notes
        other = ""
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
    topLine = [(50,650,540,650)]
    p.lines(topLine)
    p.drawString(50, 620, str("Order Details"))
    p.drawString(50, 605, str(other))
    paragraph = Paragraph(f"{body}")
    paragraph.wrapOn(p, 800, 600)
    paragraph.drawOn(p, 50, 575)
    botLine = [(50,100,540,100)]
    p.drawString(50, 80, f"Call Handler: {request.user.username}")
    p.drawString(50, 65, f"Created: {created_at}")
    p.drawString(50, 50, f"Due on: {due_at}")
    p.drawString(400, 80, f"Assigned to: {details.operator}")
    p.drawString(400, 65, f"Status: {details.status}")
    p.lines(botLine)
    p.showPage()
    p.save()
    buffer.seek(0)
    return FileResponse(buffer, as_attachment=True, filename=f"Order-{order_number}.pdf")


