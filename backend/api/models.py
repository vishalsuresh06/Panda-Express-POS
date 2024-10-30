from django.db import models

class Order(models.Model):
    date = models.DateTimeField(auto_now_add=True)
    type = models.CharField(max_length=100)
    total_price = models.DecimalField(decimal_places=2, max_digits=10)

    employee = models.ForeignKey('api.Employee', on_delete=models.RESTRICT)
    customer_name = models.CharField(max_length=100)

    def get_order_items(self):
        return self.orderitem_set.all()

    def __str__(self):
        return f"Order #{self.id}"



class Employee(models.Model):
    name = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    is_manager = models.BooleanField()
    pay = models.DecimalField(decimal_places=2, max_digits=10)

    def __str__(self):
        return self.name


class OrderItemType(models.Model):
    name = models.CharField(max_length=100)
    base_price = models.DecimalField(decimal_places=2, max_digits=10)

    def __str__(self):
        return self.name

class OrderItem(models.Model):
    order = models.ForeignKey('api.Order', on_delete=models.CASCADE, related_name="order_items") 
    order_item_type = models.ForeignKey('api.OrderItemType', models.RESTRICT)
    food_items = models.ManyToManyField('api.FoodItem')

    def __str__(self):
        return f"OrderItem #{self.id} for Order #{self.order.id}"

class FoodItem(models.Model):
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=100)
    alt_price = models.DecimalField(decimal_places=2, max_digits=10)
    upcharge = models.DecimalField(decimal_places=2, max_digits=10)
    on_menu = models.BooleanField()
    
    inventory_items = models.ManyToManyField('api.InventoryItem', through='FoodInventoryQuantity')

    def __str__(self):
        return self.name

class InventoryItem(models.Model):
    name = models.CharField(max_length=100)
    is_food = models.BooleanField()
    stock = models.IntegerField()
    restock_threshold = models.IntegerField()
    restock_amount = models.IntegerField()

    def __str__(self):
        return self.name

class FoodInventoryQuantity(models.Model):
    food_item = models.ForeignKey('api.FoodItem', on_delete=models.CASCADE)
    inventory_item = models.ForeignKey('api.InventoryItem', on_delete=models.CASCADE)
    quantity = models.IntegerField()
    
    # Ensures unique instances of food+inventory item combos
    class Meta:
        unique_together = ('food_item', 'inventory_item')

    def __str__(self):
        return f"{self.food_item} --> {self.inventory_item} : {self.quantity}"

