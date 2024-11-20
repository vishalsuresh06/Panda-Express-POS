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
    # def post(self, request):
    #     action = request.data['action']
    #     data = request.data['data']
        
    #     if action == "add":
    #         serializer = FoodItemSerializer(data=data)
    #         if serializer.is_valid():
    #             serializer.save()

    #             return JsonResponse({"success": True}, status=status.HTTP_201_CREATED)

    #         return JsonResponse({"success": True}, status=status.HTTP_201_CREATED)
    #     elif action == "delete":
    #         fooditem = FoodItem.objects.get(id=data)
    #         fooditem.delete()

    #         return JsonResponse({"success": True}, status=status.HTTP_201_CREATED)
    #     else:
    #         fooditem = FoodItem.objects.get(id=data['id'])
    #         serializer = FoodItemSerializer(fooditem, data=data, partial=True)

    #         if serializer.is_valid():
    #             serializer.save()
    #             return JsonResponse({"success": True}, status=status.HTTP_201_CREATED)
    #         else:
    #             print("Invalid input")

    #     return JsonResponse({"success": False}, status=status.HTTP_406_NOT_ACCEPTABLE)