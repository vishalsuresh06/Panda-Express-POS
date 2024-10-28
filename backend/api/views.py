from rest_framework.decorators import api_view
from rest_framework.response import Response

from django.http import JsonResponse
from django.core import serializers
from .models import Employee

@api_view(['GET'])
def helloworld(request):
    return Response("Hello, World!")

@api_view(['GET'])
def getEmployee(request):
    rawData = Employee.objects.all(id=0)
    serializedData = serializers.serialize('json', rawData)
    return JsonResponse(serializedData, safe=False)
