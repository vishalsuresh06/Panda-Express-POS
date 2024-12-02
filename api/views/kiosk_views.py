from django.http import JsonResponse
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from api.serializers import *
from api.models import *
from datetime import datetime


class KioskView(APIView):
    def get(self, request):
        rawData = FoodItem.objects.all()
        serializer = FoodItemSerializer(rawData, many=True)
        return JsonResponse(serializer.data, safe=False)
    
    def post(self, request):
        try:
            orderData = request.data

            newOrder = Order.objects.create(
                customer_name       = orderData["name"],
                employee            = Employee.objects.get(name=orderData["employee"]),
                date_created        = datetime.now(),
                date_processed      = None,  
                type                = orderData["type"],
                status              = Order.PENDING,
                total_price         = orderData["total"]
            )

            for orderItemData in orderData["orderItems"]:
                newOrderItem = OrderItem.objects.create(
                    order = newOrder,
                    order_item_type = OrderItemType.objects.get(name=orderItemData["name"]) 
                )

                foodItems = []
                for foodItemData in orderItemData["items"]:
                    foodItems.append(FoodItem.objects.get(id=foodItemData["id"]))
                newOrderItem.food_items.set(foodItems)

            return JsonResponse({"success": True}, status=status.HTTP_200_OK)

        except Exception as e:
            print(e)
            return JsonResponse({"success": False}, status=status.HTTP_406_NOT_ACCEPTABLE)

class OrderTypes(APIView):
    def get(self, request):
        rawData = OrderItemType.objects.all()
        serializer = OrderItemTypeSerializer(rawData, many=True)
        return JsonResponse(serializer.data, safe=False)