from rest_framework import serializers
from .models import *

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['id', 'name', 'is_manager', 'wage']

class OrderItemTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItemType
        fields = ['id', 'name', 'base_price']

class FoodItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodItem
        fields = ['id', 'name', 'type', 'alt_price', 'upcharge', 'on_menu']

class OrderItemSerializer(serializers.ModelSerializer):
    order_item_type = OrderItemTypeSerializer(many=False, read_only=True)
    food_items = FoodItemSerializer(many=True, read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'order_item_type', 'food_items']

class OrderSerializer(serializers.ModelSerializer):
    order_items = OrderItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Order
        fields = ['id', 'date', 'type', 'total_price', 'employee', 'customer_name', 'order_items']



