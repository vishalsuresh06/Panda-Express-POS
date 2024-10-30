from django.contrib import admin
from .models import *


# These classes allow for easier creation of orders on the admin page
class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 1

class OrderAdmin(admin.ModelAdmin):
    inlines = [OrderItemInline]

admin.site.register(Order, OrderAdmin)
admin.site.register(OrderItem)
admin.site.register(OrderItemType)
admin.site.register(Employee)


class FoodInventoryInline(admin.TabularInline):
    model = FoodInventoryQuantity
    extra = 1
    fk_name = "food_item"

class FoodItemAdmin(admin.ModelAdmin):
    inlines = [FoodInventoryInline]

admin.site.register(FoodItem, FoodItemAdmin)
admin.site.register(InventoryItem)
admin.site.register(FoodInventoryQuantity)

