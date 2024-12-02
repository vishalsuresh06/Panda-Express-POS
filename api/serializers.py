from rest_framework import serializers
from api.models import *

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['id', 'name', 'pin', 'is_manager', 'wage']

class OrderItemTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItemType
        fields = ['id', 'name', 'base_price']

class FoodItemSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True, required=False)
    
    class Meta:
        model = FoodItem
        fields = ['id', 'name', 'type', 'alt_price', 'upcharge', 'on_menu', 'image', 'calories', 'is_spicy', 'is_premium', 'is_gluten_free']

class OrderFoodQuantitySerializer(serializers.ModelSerializer):
    food_item = serializers.ReadOnlyField(source='food_item.name')

    class Meta:
        model = OrderFoodQuantity
        fields = ['food_item', 'quantity']
class InventoryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryItem
        fields = ['id', 'name', 'is_food', 'stock', 'restock_threshold', 'restock_amount']

class OrderItemSerializer(serializers.ModelSerializer):
    order_item_type = OrderItemTypeSerializer(many=False, read_only=True)
    food_items = OrderFoodQuantitySerializer(many=True, read_only=True, source='orderfoodquantity_set')

    class Meta:
        model = OrderItem
        fields = ['id', 'order_item_type', 'food_items']

class OrderSerializer(serializers.ModelSerializer):
    order_items = OrderItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Order
        fields = ['id', 'date_created', 'type', 'total_price', 'employee', 'customer_name', 'order_items', 'status']

class SettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SettingParameter
        fields = ['key', 'value', 'default']

