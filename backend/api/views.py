from rest_framework.decorators import api_view
from rest_framework.response import Response

from django.http import JsonResponse
from django.core import serializers
from .serializers import OrderSerializer, OrderItemSerializer, FoodItemSerializer, OrderItemTypeSerializer
from .models import *

@api_view(['GET'])
def helloworld(request):
    return Response("Hello, World!")

@api_view(['GET'])
def getEmployees(request):
    rawData = Employee.objects.all()
    serializedData = serializers.serialize('json', rawData)
    return JsonResponse(serializedData, safe=False)

@api_view(['GET'])
def getOrders(request):
    rawData = Order.objects.all()
    serializer = OrderSerializer(rawData, many=True);
    return JsonResponse(serializer.data, safe=False);
