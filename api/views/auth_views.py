import json
from django.http import JsonResponse
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, login
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

