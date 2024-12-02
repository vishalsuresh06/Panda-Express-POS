from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.models import FoodItem
from api.serializers import FoodItemSerializer


class MenuView(APIView):
    """
    View to manage food items on the menu.
    """

    def get(self, request):
        """
        Fetch all food items that are currently on the menu, filtered by type or name if provided.
        """
        try:
            food_type = request.query_params.get("type", None)
            food_name = request.query_params.get("name", None)

            if food_name:
                menu_items = FoodItem.objects.filter(name__iexact=food_name)
            elif food_type:
                menu_items = FoodItem.objects.filter(type__iexact=food_type, on_menu=True)
            else:
                menu_items = FoodItem.objects.filter(on_menu=True)

            serializer = FoodItemSerializer(menu_items, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"error": "An error occurred while fetching the menu.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def post(self, request):
        """
        Add a new food item to the menu.
        """
        try:
            serializer = FoodItemSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(
                {"error": "An error occurred while adding the item.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def put(self, request, pk):
        """
        Update an existing food item.
        """
        try:
            food_item = FoodItem.objects.get(pk=pk)
            serializer = FoodItemSerializer(food_item, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except FoodItem.DoesNotExist:
            return Response(
                {"error": "The item does not exist."}, status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": "An error occurred while updating the item.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def delete(self, request, pk):
        """
        Remove a food item from the menu.
        """
        try:
            food_item = FoodItem.objects.get(pk=pk)
            food_item.delete()
            return Response(
                {"message": "Item deleted successfully."}, status=status.HTTP_200_OK
            )
        except FoodItem.DoesNotExist:
            return Response(
                {"error": "The item does not exist."}, status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": "An error occurred while deleting the item.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
