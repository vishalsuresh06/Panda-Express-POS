from django.http import JsonResponse
from django.db.models import Q
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from api.serializers import *
from api.models import *
import datetime


class OrderHistoryView(APIView):
    
    # Sends orders completed or canceled within the last X seconds (max_age)
    def get(self, request):
        max_age = request.query_params.get("max_age");
        delta = datetime.datetime.now() - datetime.timedelta(seconds=int(max_age));
        orderData = Order.objects.filter(Q(status='completed') | Q(status='cancelled'), date__gte=delta).order_by('date')        
        serializer = OrderSerializer(orderData, many=True)

        return JsonResponse(serializer.data, safe=False)
    
    # Used to move an order back to the main screen (pending)
    def post(self, request):
        orderID = request.data['orderID']

        try:
            order = Order.objects.get(id=orderID)
            order.status = "pending"
            order.save()
            return JsonResponse({"success": False}, status=status.HTTP_200_OK)
        except:
            return JsonResponse({"success": True}, status=status.HTTP_406_NOT_ACCEPTABLE)

class KitchenOrders(APIView):
    
    # Sends pending orders to the kitchen display
    def get(self, request):
        statusQuery = Q(status='pending') | Q(status='in_progress')

        hereOrderData = Order.objects.filter(statusQuery, type='here').order_by('date')
        togoOrderData = Order.objects.filter(statusQuery, type='togo').order_by('date')
        
        hereSerializer = OrderSerializer(hereOrderData, many=True)
        togoSerializer = OrderSerializer(togoOrderData, many=True)

        response = {
            "here": hereSerializer.data,
            "togo": togoSerializer.data
        }
        return JsonResponse(response, safe=False)

    # Allows kitchen to cancel or complete a target order
    def post(self, request):
        action = request.data['action']
        orderID = request.data['orderID']
        
        # Search database for order with matching id
        try:
            targetOrder = Order.objects.get(id=orderID)
        except Order.DoesNotExist:
            return JsonResponse({"success": True}, status=status.HTTP_406_NOT_ACCEPTABLE)
        
        # IF passed a valid action, perform that action on the target order
        if action == "confirm" or action == "cancel":
            targetOrder.status = action
            targetOrder.save()
            return JsonResponse({"success": False}, status=status.HTTP_200_OK)
        elif action == "toggle":
            targetOrder.status = "in_progress" if targetOrder.status == "pending" else "pending"
            targetOrder.save()
            return JsonResponse({"success": False}, status=status.HTTP_200_OK)
        else:
            return JsonResponse({"success": True}, status=status.HTTP_406_NOT_ACCEPTABLE)

