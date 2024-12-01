from django.http import JsonResponse
from django.core import serializers
from django.db.models import F, Sum
from django.db.models.functions import TruncDay
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from api.serializers import *
from api.models import *
from datetime import datetime, timedelta

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

@api_view(['GET'])
def menuQueryView(request, id):
    start_date_str = request.GET.get('start_date')
    end_date_str = request.GET.get('end_date')

    try:
        start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
        end_date = datetime.strptime(end_date_str, '%Y-%m-%d')
    except ValueError:
        return JsonResponse({"success": False}, status=status.HTTP_406_NOT_ACCEPTABLE)

    days = [start_date + timedelta(days = i) for i in range((end_date - start_date).days + 1)]

    results = (
        Order.objects.filter(
            date_created__range=[start_date, end_date],
            order_items__orderfoodquantity__food_item_id=id,
        )
        .annotate(day=TruncDay("date_created"))
        .values("day")
        .annotate(total_quantity=Sum("order_items__orderfoodquantity__quantity"))
        .order_by("day")
    )


    results_dict = {result["day"].date(): result["total_quantity"] for result in results}

    final_results = []
    for date in days:
        final_results.append({
            "date": date.date(),
            "quantity": results_dict.get(date.date(), 0)
    })

    return Response(final_results, status=status.HTTP_200_OK)

@api_view(['GET'])
def inventoryQueryView(request, id):
    start_date_str = request.GET.get('start_date')
    end_date_str = request.GET.get('end_date')

    try:
        start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
        end_date = datetime.strptime(end_date_str, '%Y-%m-%d')
    except ValueError:
        return JsonResponse({"success": False}, status=status.HTTP_406_NOT_ACCEPTABLE)

    days = [start_date + timedelta(days = i) for i in range((end_date - start_date).days + 1)]

    results = (
        Order.objects.filter(
            date_created__range=[start_date, end_date],
            order_items__orderfoodquantity__food_item__foodinventoryquantity__inventory_item_id=id,
        )
        .annotate(day=TruncDay("date_created"))
        .values("day", "order_items__orderfoodquantity__food_item__foodinventoryquantity__inventory_item_id")
        .annotate(
            total_quantity=Sum(
                F("order_items__orderfoodquantity__quantity")
                * F("order_items__orderfoodquantity__food_item__foodinventoryquantity__quantity")
            )
        )
        .order_by("day")
    )


    results_dict = {result["day"].date(): result["total_quantity"] for result in results}

    final_results = []
    for date in days:
        final_results.append({
            "date": date.date(),
            "quantity": results_dict.get(date.date(), 0)
    })

    return Response(final_results, status=status.HTTP_200_OK)
