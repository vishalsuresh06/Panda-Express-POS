from django.http import JsonResponse
from django.core import serializers
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from api.serializers import *
from api.models import *
from datetime import datetime
from collections import Counter


class EmployeeView(APIView):
    def get(self, request):
        rawData = Employee.objects.all()
        serializer = EmployeeSerializer(rawData, many=True)
        return JsonResponse(serializer.data, safe=False)
    def post(self, request):
        action = request.data['action']
        data = request.data['data']
        
        if action == "add":
            serializer = EmployeeSerializer(data=data)
            if serializer.is_valid():
                serializer.save()

                return JsonResponse({"success": True}, status=status.HTTP_201_CREATED)

            return JsonResponse({"success": True}, status=status.HTTP_201_CREATED)
        elif action == "delete":
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

class MenuView(APIView):
    def get(self, request):
        rawData = FoodItem.objects.all()
        serializer = FoodItemSerializer(rawData, many=True)
        return JsonResponse(serializer.data, safe=False)
    def post(self, request):
        action = request.data['action']
        data = request.data['data']
        
        if action == "add":
            serializer = FoodItemSerializer(data=data)
            if serializer.is_valid():
                serializer.save()

                return JsonResponse({"success": True}, status=status.HTTP_201_CREATED)

            return JsonResponse({"success": True}, status=status.HTTP_201_CREATED)
        elif action == "delete":
            fooditem = FoodItem.objects.get(id=data)
            fooditem.delete()

            return JsonResponse({"success": True}, status=status.HTTP_201_CREATED)
        else:
            fooditem = FoodItem.objects.get(id=data['id'])
            serializer = FoodItemSerializer(fooditem, data=data, partial=True)

            if serializer.is_valid():
                serializer.save()
                return JsonResponse({"success": True}, status=status.HTTP_201_CREATED)
            else:
                print("Invalid input")

        return JsonResponse({"success": False}, status=status.HTTP_406_NOT_ACCEPTABLE)
    
class InventoryView(APIView):
    def get(self, request):
        rawData = InventoryItem.objects.all()
        serializer = InventoryItemSerializer(rawData, many=True)
        return JsonResponse(serializer.data, safe=False)
    def post(self, request):
        action = request.data['action']
        data = request.data['data']
        
        if action == "add":
            serializer = InventoryItemSerializer(data=data)
            if serializer.is_valid():
                serializer.save()

                return JsonResponse({"success": True}, status=status.HTTP_201_CREATED)

            return JsonResponse({"success": True}, status=status.HTTP_201_CREATED)
        elif action == "delete":
            fooditem = InventoryItem.objects.get(id=data)
            fooditem.delete()

            return JsonResponse({"success": True}, status=status.HTTP_201_CREATED)
        else:
            fooditem = InventoryItem.objects.get(id=data['id'])
            serializer = InventoryItemSerializer(fooditem, data=data, partial=True)

            if serializer.is_valid():
                serializer.save()
                return JsonResponse({"success": True}, status=status.HTTP_201_CREATED)
            else:
                print("Invalid input")

        return JsonResponse({"success": False}, status=status.HTTP_406_NOT_ACCEPTABLE)
    
class ExcessView(APIView):
    def get(self, request):
        timestamp = request.GET.get("timestamp")
        orders = Order.objects.filter(date_created__range=[timestamp, datetime.now()])
        
        # Count quantity of each food item sold
        foodCounts = Counter()
        for order in orders:
            for orderItem in order.order_items.all():
                for foodItem in orderItem.food_items.all():
                    foodQuantity = orderItem.orderfoodquantity_set.get(food_item=foodItem).quantity
                    foodCounts[foodItem] += foodQuantity

        # Count quantity of each inventory item sold based on food sales
        itemCounts = dict([(invItem, 0) for invItem in InventoryItem.objects.all()])
        for foodItem, foodQuantity in foodCounts.items():
            for invFoodPair in foodItem.foodinventoryquantity_set.all():
                itemCounts[invFoodPair.inventory_item] += invFoodPair.quantity * foodQuantity

        # Format JSON for return
        excessItems = []
        for invItem, quantitySold in itemCounts.items():
            percentSold = int(100*quantitySold/(invItem.stock + quantitySold))

            excessItems.append({"name": str(invItem),
                                "quantitySold": quantitySold,
                                "percentSold": percentSold})
        
        excessItems.sort(key=lambda item: item["percentSold"])
        return JsonResponse(excessItems, safe=False, status=status.HTTP_200_OK)