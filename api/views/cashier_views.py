from django.http import JsonResponse
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from api.serializers import *
from api.models import *
from datetime import datetime
from collections import Counter
import pytz


class CashierView(APIView):
    def get(self, request):
        rawData = FoodItem.objects.all()
        serializer = FoodItemSerializer(rawData, many=True)
        return JsonResponse(serializer.data, safe=False)
    
    def post(self, request):
        try:
            orderData = request.data
            print(orderData)

            timezone = pytz.timezone('America/Chicago')
            newOrder = Order.objects.create(
                customer_name       = orderData["name"],
                employee            = Employee.objects.get(name=orderData["employee"]),
                date_created        = timezone.localize(datetime.now()),
                date_processed      = None,  
                type                = orderData["type"],
                status              = orderData.get("status", Order.PENDING),  
                total_price         = orderData["total"]
            )



            for orderItemData in orderData["orderItems"]:
                newOrderItem = OrderItem.objects.create(
                    order = newOrder,
                    order_item_type = OrderItemType.objects.get(name=orderItemData["name"]) 
                )


                foodItemCounter = Counter()
                for foodItemData in orderItemData["items"]:
                    foodItemCounter[FoodItem.objects.get(id=foodItemData["id"])] += 1
                
                for foodItem, quantity in foodItemCounter.items():
                    OrderFoodQuantity.objects.create(
                        order_item = newOrderItem,
                        food_item = foodItem,
                        quantity= quantity
                    )


            return JsonResponse({"success": True}, status=status.HTTP_200_OK)

        except Exception as e:
            print(e)
            return JsonResponse({"success": False}, status=status.HTTP_406_NOT_ACCEPTABLE)

class OrderTypes(APIView):
    def get(self, request):
        rawData = OrderItemType.objects.all()
        serializer = OrderItemTypeSerializer(rawData, many=True)
        return JsonResponse(serializer.data, safe=False)