import json
from django.http import JsonResponse
from django.contrib.auth import authenticate, login
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from google.auth import jwt
from api.models import Employee

@api_view(['POST'])
def pinLogin(request):
    data = json.loads(request.body)

    id = data.get('id')
    pin = data.get('pin')

    user = authenticate(request, id=id, pin=pin)

    if not user:
        return JsonResponse({"success": False, "message": "ID or Pin is wrong"}, status=status.HTTP_406_NOT_ACCEPTABLE)
    
    token, created = Token.objects.get_or_create(user=user)

    employee = Employee.objects.get(id=id, pin=pin)

    return Response({
        'token': token.key,
        'id': user.id,
        'isManager': employee.is_manager,
        'name': employee.name,
     })

@api_view(['POST'])
def googleLogin(request):
    data = json.loads(request.body)

    credential = data.get('credential')

    if not credential:
        return JsonResponse({"success": False, "message": "Failed to get credentials"}, status=status.HTTP_406_NOT_ACCEPTABLE)
    
    user = jwt.decode(credential, verify=False)

    if not user:
        return JsonResponse({"success": False, "message": "Could not find Google user"}, status=status.HTTP_406_NOT_ACCEPTABLE)

    employee = Employee.objects.get(email=user['email'])

    if not employee:
        return JsonResponse({"success": False, "message": "Email not linked to a user. Ask a manager"}, status=status.HTTP_406_NOT_ACCEPTABLE)

    token, created = Token.objects.get_or_create(user=employee)

    return Response({
        'token': token.key,
        'id': employee.id,
        'isManager': employee.is_manager,
        'name': employee.name,
     })

