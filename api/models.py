from django.db import models

#TODO restrict food item types 

class Order(models.Model):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

    STATUS_CHOICES = {
        PENDING: "Pending",
        IN_PROGRESS: "In Progress",
        COMPLETED: "Completed",
        CANCELLED: "Cancelled",
    }

    HERE = "here"
    TOGO = "togo"
    TYPE_CHOICES = {
        HERE: "Here",
        TOGO: "Togo",
    }

    customer_name = models.CharField(max_length=100)
    employee = models.ForeignKey('api.Employee', on_delete=models.RESTRICT)
    date = models.DateTimeField()
    type = models.CharField(max_length=100, choices=TYPE_CHOICES, default='here')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    total_price = models.DecimalField(decimal_places=2, max_digits=10)

    def get_order_items(self):
        return self.orderitem_set.all()

    def __str__(self):
        return f"Order #{self.id}"



class Employee(models.Model):
    name = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    is_manager = models.BooleanField()
    wage = models.DecimalField(decimal_places=2, max_digits=10)

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
    food_items = models.ManyToManyField('api.FoodItem', through="OrderFoodQuantity")

    def __str__(self):
        return f"OrderItem #{self.id} for Order #{self.order.id}"

class FoodItem(models.Model):
    ENTREE = "entree"
    SIDE = "side"
    APPETIZER = "appetizer"
    DESSERT = "dessert"
    DRINK = "drink"

    TYPE_CHOICES = [
        (ENTREE , "Entree"),
        (SIDE , "Side"),
        (APPETIZER , "Appetizer"),
        (DESSERT , "Dessert"),
        (DRINK , "Drink"),
    ]

    name = models.CharField(max_length=100)
    type = models.CharField(max_length=100, choices=TYPE_CHOICES, default= ENTREE)
    alt_price = models.DecimalField(decimal_places=2, max_digits=10)
    upcharge = models.DecimalField(decimal_places=2, max_digits=10)
    on_menu = models.BooleanField()

    image = models.ImageField(upload_to='food_images/', null=True, blank=True)
    calories = models.IntegerField(null=True, blank=True)
    is_spicy = models.BooleanField(default=False)
    is_premium = models.BooleanField(default=False)
    is_gluten_free = models.BooleanField(default=False)

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

class OrderFoodQuantity(models.Model):
    order_item = models.ForeignKey('api.OrderItem', on_delete=models.CASCADE)
    food_item = models.ForeignKey('api.FoodItem', on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)

    class Meta:
        unique_together = ('order_item', 'food_item')