from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from volunteercenter.serializers import UserSerializer, deliverySerializer, prescriptionSerializer, welfareSerializer
from volunteercenter.models import User, Delivery, Prescription, Welfare

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