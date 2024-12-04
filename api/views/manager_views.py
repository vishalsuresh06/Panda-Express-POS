from django.http import JsonResponse
from django.core import serializers
from django.db.models import F, Sum, Count, Q
from django.db.models.functions import TruncDay, ExtractHour
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from api.serializers import *
from api.models import *
from datetime import datetime, timedelta
import pytz

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
        results = (
            Order.objects.filter(
                date_created__range=[timestamp, datetime.now()],
            )
            .annotate(invItemName = F("order_items__orderfoodquantity__food_item__foodinventoryquantity__inventory_item__name"))
            .values("invItemName")
            .annotate(
                quantitySold=Sum(
                    F("order_items__orderfoodquantity__quantity")
                    * F("order_items__orderfoodquantity__food_item__foodinventoryquantity__quantity")
                )
            )
        )   

        counts = dict([(invItem.name, 0) for invItem in InventoryItem.objects.all()])
        for result in results:
            counts[result["invItemName"]] = result["quantitySold"]

        # Format JSON for return
        excessItems = []
        for invItemName, quantitySold in counts.items():
            invItem = InventoryItem.objects.get(name=invItemName)

            percentSold = int(100*quantitySold/(invItem.stock + quantitySold))

            excessItems.append({"name": str(invItem),
                                "quantitySold": quantitySold,
                                "percentSold": percentSold})
        
        excessItems.sort(key=lambda item: item["percentSold"])
        return JsonResponse(excessItems, safe=False, status=status.HTTP_200_OK)
    
class SellsTogetherView(APIView):
    def get(self, request):
        try:
            startDate = datetime.strptime(request.GET.get("startDate"), '%Y-%m-%d')
            endDate = datetime.strptime(request.GET.get("endDate"), '%Y-%m-%d')
            
            menuItemPairs = dict()
            foodItems = list(FoodItem.objects.filter(Q(type="entree") | Q(type="side")))
            for i in range(len(foodItems)):
                for j in range(i+1, len(foodItems)):
                    food1 = foodItems[i]
                    food2 = foodItems[j]

                    pairQuery = (
                        Order.objects.filter(
                            date_created__range=[startDate, endDate],
                        )
                        .annotate(orderItemID=F("order_items__id"))
                        .values("orderItemID")
                        .annotate(food1Count = Count("order_items__orderfoodquantity__food_item", filter=Q(order_items__orderfoodquantity__food_item=food1)),
                                  food2Count = Count("order_items__orderfoodquantity__food_item", filter=Q(order_items__orderfoodquantity__food_item=food2)))
                        .filter(food1Count__gt=0, food2Count__gt=0)
                    )   

                    menuItemPairs[(food1, food2)] = pairQuery.count()
            
            pairCounts = sorted(menuItemPairs.items(), key=lambda item: item[1], reverse=True)
            response = []
            for (foodItem1, foodItem2), count in pairCounts:
                response.append({
                    "foodItem1": foodItem1.name,
                    "foodItem2": foodItem2.name,
                    "count": count
                })
            return JsonResponse(response, safe=False, status=status.HTTP_202_ACCEPTED)
                            
        except Exception as e:
            print(e)
            return JsonResponse({"success":False}, status=status.HTTP_400_BAD_REQUEST)

class RestockView(APIView):
    def get(self, request):
        try:
            response = []
            for invItem in InventoryItem.objects.all():
                if invItem.stock < invItem.restock_threshold:
                    response.append({
                        "name": invItem.name,
                        "stock": invItem.stock,
                        "restock_threshold": invItem.restock_threshold,
                        "restock_amount": invItem.restock_amount
                    })

            return JsonResponse(response, safe=False, status=status.HTTP_200_OK)

        except Exception as e:
            print(e)
            return JsonResponse({"success":False}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        try:
            invItemReq = request.data["invItem"]
            invItem = InventoryItem.objects.get(name=invItemReq["name"])
            invItem.stock += invItem.restock_amount
            invItem.save()
            return JsonResponse({"success":True}, status=status.HTTP_200_OK)


        except Exception as e:
            print(e)
            return JsonResponse({"success":False}, status=status.HTTP_400_BAD_REQUEST)

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

class XZReports(APIView):
    def getSalesToday(self):
        timezone = pytz.timezone('America/Chicago')
        today = timezone.localize(datetime.now())
        startOfDay= today.replace(hour=0, minute=0, second=0, microsecond=0)
        currentTime = timezone.localize(datetime.now());

        return today, (
            Order.objects.filter(
                date_created__range=[startOfDay, currentTime],
            )
            .annotate(hour=ExtractHour("date_created"))
            .values("hour")
            .annotate(
                hourlySales=Sum("total_price"),
                hourlyOrders=Count("id")
            )
            .order_by("hour")
        )

    def generateXReport(self):
        today, results = self.getSalesToday()

        response = {
            "date": today,
            "totalSales": 0,
            "totalOrders": 0,
            "hourlySales": [{"hour": hour, "sales":0} for hour in range(today.hour+1)]
        }
        for result in results:
            response["totalSales"] += result["hourlySales"]
            response["totalOrders"] += result["hourlyOrders"]
            response["hourlySales"][result["hour"]]["sales"] = float(result["hourlySales"])
        
        return JsonResponse(response, status=status.HTTP_200_OK)

    def generateZReport(self):
        today, results = self.getSalesToday()

        response = {
            "date": today,
            "totalSales": 0,
            "totalOrders": 0,
            "hourlySales": [{"hour": hour, "sales":0} for hour in range(24)]
        }
        for result in results:
            response["totalSales"] += result["hourlySales"]
            response["totalOrders"] += result["hourlyOrders"]
            response["hourlySales"][result["hour"]]["sales"] = float(result["hourlySales"])
        
        return JsonResponse(response, status=status.HTTP_200_OK)
    
    def get(self, request):
        try:
            reportType = request.GET.get("type")
            if reportType == "x":
                return self.generateXReport()
            elif reportType == "z":
                return self.generateZReport()
            else:
                raise Exception("Invalid Report Type")

        except Exception as e:
            print(e)
            return JsonResponse({"success":False}, status=status.HTTP_400_BAD_REQUEST)

class OrderHistoryView(APIView):
    def get(self, request):
        try:
            targetDate = request.GET.get("date")
            orders = Order.objects.filter(date_created__date=targetDate).order_by("-date_created")
            return JsonResponse(OrderSerializer(orders, many=True).data , safe=False, status=status.HTTP_200_OK)

        except Exception as e:
            print(e)
            return JsonResponse({"success":False}, status=status.HTTP_400_BAD_REQUEST);


    def post(self, request):
        try:
            targetOrderID = request.data["orderID"]
            targetOrder = Order.objects.get(id=targetOrderID)
            targetOrder.delete()

        except Exception as e:
            print(e)
            return JsonResponse({"success":False}, status=status.HTTP_400_BAD_REQUEST);







    