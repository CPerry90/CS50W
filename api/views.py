from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from volunteercenter.serializers import UserSerializer, deliverySerializer, prescriptionSerializer, welfareSerializer
from volunteercenter.models import User, Delivery, Prescription, Welfare
import io
from django.http import FileResponse
from reportlab.pdfgen import canvas

@csrf_exempt
@login_required
def user_search(request):
    clients = []
    if request.user.is_authenticated:
        _clients = User.objects.filter(user_type="client")
        for client in _clients:
            serializer = UserSerializer(client)
            clients.append(serializer.data)
        return JsonResponse({
            "clients": clients
        }, safe=False)
    else:
        return

@csrf_exempt
@login_required
def client_details(request, id):
    list = {}
    if request.user.is_authenticated:
        client = User.objects.get(pk=id)
        if Delivery.objects.filter(delivery_client=client).exists():
            delivery = []
            for _delivery in Delivery.objects.filter(delivery_client=client):
                _deliverySerializer = deliverySerializer(_delivery)
                delivery.append(_deliverySerializer.data)
            list["delivery"] = delivery
        if Prescription.objects.filter(prescription_client=client).exists():
            prescription = []
            for _prescription in Prescription.objects.filter(prescription_client=client):
                _prescriptionSerializer = prescriptionSerializer(_prescription)
                prescription.append(_prescriptionSerializer.data)
            list["prescription"] = prescription
        if Welfare.objects.filter(welfare_client=client).exists():
            welfare = []
            for welfare in Prescription.objects.filter(welfare_client=client):
                welfareSerializer = prescriptionSerializer(welfare)
                welfare.append(welfareSerializer.data)
            list["welfare"] = welfare
        return JsonResponse({
            "data": list
        }, safe=False)
    else:
        return

@csrf_exempt
@login_required
def order_details(request, id):
    if request.user.is_authenticated:

        if Delivery.objects.filter(order_number=id).exists():
            details = Delivery.objects.get(order_number=id)
            serializer = deliverySerializer(details)
        if Prescription.objects.filter(order_number=id).exists():
            details = Prescription.objects.get(order_number=id)
            serializer = prescriptionSerializer(details)
        if Welfare.objects.filter(order_number=id).exists():
            details = Welfare.objects.get(order_number=id)
            serializer = welfareSerializer(details)   

        return  JsonResponse({
            "details": serializer.data
        }, safe=False)

@csrf_exempt
@login_required
def pdf(request):
    buffer = io.BytesIO()
    p = canvas.Canvas(buffer)
    p.drawString(100, 100, "Hello world.")
    p.showPage()
    p.save()
    buffer.seek(0)
    return FileResponse(buffer, as_attachment=True, filename='hello.pdf')