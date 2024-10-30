from django.http import JsonResponse
from django.core import serializers
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import *
from .models import *

@api_view(['GET'])
def helloworld(request):
    return Response("Hello, World!")

class EmployeeView(APIView):
    def get(self, request):
        rawData = Employee.objects.all()
        serializer = EmployeeSerializer(rawData, many=True)
        return JsonResponse(serializer.data, safe=False)
    def post(self, request):
        print(request.data)
        action = request.data['action']
        data = request.data['data']
        
        if action == "add":
            serializer = EmployeeSerializer(data=data)
            if serializer.is_valid():
                serializer.save()

                return JsonResponse({"success": True}, status=status.HTTP_201_CREATED)

            return JsonResponse({"success": True}, status=status.HTTP_201_CREATED)
        elif action == "delete":
            print("Test")
            employee = Employee.objects.get(id=data)
            employee.delete()

            return JsonResponse({"success": True}, status=status.HTTP_201_CREATED)
        else:
            employee = Employee.objects.get(id=data['id'])
            serializer = EmployeeSerializer(employee, data=data, partial=True)

            if serializer.is_valid():
                serializer.save()
                return JsonResponse({"success": True}, status=status.HTTP_201_CREATED)
            else:
                print("Invalid input")

        return JsonResponse({"success": False}, status=status.HTTP_406_NOT_ACCEPTABLE)

@api_view(['GET'])
def getOrders(request):
    rawData = Order.objects.all()
    serializer = OrderSerializer(rawData, many=True)
    return JsonResponse(serializer.data, safe=False)
