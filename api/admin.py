from django.contrib import admin
from .models import *
from nested_admin import NestedTabularInline, NestedModelAdmin

# Inlines to allow for easier 
class FoodInventoryInline(admin.TabularInline):
    model = FoodInventoryQuantity
    extra = 1
    sortable_options = []

class FoodItemInline(NestedTabularInline):
    model = FoodItem
    extra = 1

class OrderFoodInline(NestedTabularInline):
    model = OrderFoodQuantity
    extra = 1
    fk_name = "order_item"

class OrderItemInline(NestedTabularInline):
    model = OrderItem
    extra = 1
    inlines = [OrderFoodInline]
    autocomplete_fields = ['order_item_type'] 


# Admin classes
class OrderAdmin(NestedModelAdmin):
    inlines = [OrderItemInline]

class FoodItemAdmin(NestedModelAdmin):
    inlines = [FoodInventoryInline]

class OrderItemAdmin(NestedModelAdmin):
    inlines = [OrderFoodInline]

class OrderItemTypeAdmin(admin.ModelAdmin):
    search_fields = ['name']  


# Register admin classes
admin.site.register(OrderItemType, OrderItemTypeAdmin)
admin.site.register(Order, OrderAdmin)
admin.site.register(Employee)
admin.site.register(FoodItem, FoodItemAdmin)
admin.site.register(InventoryItem)
admin.site.register(FoodInventoryQuantity)
admin.site.register(OrderItem, OrderItemAdmin)  