from django.http import JsonResponse
from django.db.models import Q
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from api.serializers import *
from api.models import *
import datetime


class RecentOrdersView(APIView):
    """
    Django view that handles all API operations involving the recent orders page 
    on the kitchen interface.
    """
    
    # Sends the last X completed or canceled orders
    def get(self, request):
        """
        Returns a sorted JSON of the last X COMPLETED or CANCELLED orders sorted so that the
        most recent orders come first where X is the count passed in the HTTP request.
        """

        # Django querysets are lazy so the list comprehension doesn't actually query for the entire database first
        count = int(request.query_params.get("count"));
        orderData = Order.objects.filter(Q(status='completed') | Q(status='cancelled')).order_by('-date_processed')[:count]
        serializer = OrderSerializer(orderData, many=True)
        return JsonResponse(serializer.data, safe=False)
    
    # Used to move an order back to the main screen (pending)
    def post(self, request):
        """
        Takes a given orderID and restores the corresponding CANCELLED or COMPLETED order
        to pending.
        """

        orderID = request.data['orderID']

        try:
            order = Order.objects.get(id=orderID)
            order.status = "pending"
            order.save()
            return JsonResponse({"success": False}, status=status.HTTP_200_OK)
        except:
            return JsonResponse({"success": True}, status=status.HTTP_406_NOT_ACCEPTABLE)

class KitchenOrders(APIView):
    """
    Django view that handles all API request involving the pending order in
    the kitchen interface.
    """
    
    # Sends pending orders to the kitchen display
    def get(self, request):
        """
        Returns a JSON containing two lists of currently pending orders (here and togo). The lists
        are sorted such that the oldest orders are listed first and they contain all kitchen-relavent 
        information about the order.
        """

        statusQuery = Q(status='pending') | Q(status='in_progress')

        hereOrderData = Order.objects.filter(statusQuery, type='here').order_by('date_created')
        togoOrderData = Order.objects.filter(statusQuery, type='togo').order_by('date_created')
        
        hereSerializer = OrderSerializer(hereOrderData, many=True)
        togoSerializer = OrderSerializer(togoOrderData, many=True)

        response = {
            "here": hereSerializer.data,
            "togo": togoSerializer.data
        }
        return JsonResponse(response, safe=False)

    # Allows kitchen to cancel or complete a target order
    def post(self, request):
        """
        Accepts an order id and an action to perform on that order that involves
        changing the status of the order to COMPLETED, CANCELLED, or IN_PROGRESS
        """

        action = request.data['action']
        orderID = request.data['orderID']
        
        # Search database for order with matching id
        try:
            targetOrder = Order.objects.get(id=orderID)
        except Order.DoesNotExist:
            return JsonResponse({"success": True}, status=status.HTTP_406_NOT_ACCEPTABLE)
        
        # IF passed a valid action, perform that action on the target order
        if action == "complete" or action == "cancel":
            targetOrder.status = "completed" if action == "complete" else "cancelled"
            targetOrder.date_processed = datetime.datetime.now()
            targetOrder.save()
            return JsonResponse({"success": False}, status=status.HTTP_200_OK)
        
        elif action == "toggle":
            targetOrder.status = "in_progress" if targetOrder.status == "pending" else "pending"
            targetOrder.save()
            return JsonResponse({"success": False}, status=status.HTTP_200_OK)
        
        else:
            return JsonResponse({"success": True}, status=status.HTTP_406_NOT_ACCEPTABLE)

