from django.http import JsonResponse
from django.core import serializers
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from api.serializers import *
from api.models import *

class KioskView(APIView):
    def get(self, request):
        rawData = FoodItem.objects.all()
        serializer = FoodItemSerializer(rawData, many=True)
        return JsonResponse(serializer.data, safe=False)
    def post(self, request):
        pass

class OrderTypes(APIView):
    def get(self, request):
        rawData = OrderItemType.objects.all()
        serializer = OrderItemTypeSerializer(rawData, many=True)
        return JsonResponse(serializer.data, safe=False)