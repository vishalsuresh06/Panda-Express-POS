from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils.translation import gettext_lazy as _

#TODO restrict food item types 

class Order(models.Model):
    """
    Model representing a single customer transaction/order

    :param customer_name: Name of the customer
    :param employee: The employee who processed the order
    :param date_created: The date and time when the order was first added to the database
    :param date_processed: The date and time when the order was last processed (completed or cancelled), can be null
    :param type: The type of order, either "Here" or "Togo"
    :param status: The current status of the order, with possible values like "Pending", "In Progress", "Completed", or "Cancelled"
    :param total_price: The total price of the order
    """

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
    date_created = models.DateTimeField() # When the order is first added to the database
    date_processed = models.DateTimeField(null=True) # The most recent time the order was "completed" or "canceled"
    type = models.CharField(max_length=100, choices=TYPE_CHOICES, default='here')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    total_price = models.DecimalField(decimal_places=2, max_digits=10)

    def get_order_items(self):
        return self.orderitem_set.all()

    def __str__(self):
        return f"Order #{self.id}"




class Employee(AbstractBaseUser, PermissionsMixin):
    """
    Model representing a single Panda Express employee

    :param name: The name of the employee
    :param pin: The PIN assigned to the employee for authentication, stored as a CharField
    :param is_manager: A boolean flag indicating if the employee is a manager
    :param wage: The wage rate of the employee
    :param email: The employee's email address, stored as an EmailField and must be unique, can be null
    """

    name = models.CharField(max_length=100)
    pin = models.CharField(max_length=6, default="1234")
    is_manager = models.BooleanField(default=False)
    wage = models.DecimalField(decimal_places=2, max_digits=10)
    is_active = models.BooleanField(default=True)  # Required for AbstractBaseUser
    is_staff = models.BooleanField(default=False)  # Required for admin access

    USERNAME_FIELD = 'id'  # Field to use as the unique identifier
    REQUIRED_FIELDS = ['name']  # Other required fields during user creation
    email = models.EmailField(unique=True, null=True)

    def __str__(self):
        return self.name

class OrderItemType(models.Model):
    """
    A model representing a specific type of order item (e.g. bowl)

    :param name: The name of the order item type
    :param base_price: The base price of the order item type
    """
    name = models.CharField(max_length=100)
    base_price = models.DecimalField(decimal_places=2, max_digits=10)

    def __str__(self):
        return self.name

class OrderItem(models.Model):
    """
    A model representing a single order item from an order (e.g. a bowl w/ food, a drink)

    :param order: The order to which the item belongs
    :param order_item_type: The type of the order item
    :param food_items: A many-to-many relationship with FoodItem, through the OrderFoodQuantity model
    """
    order = models.ForeignKey('api.Order', on_delete=models.CASCADE, related_name="order_items") 
    order_item_type = models.ForeignKey('api.OrderItemType', models.RESTRICT)
    food_items = models.ManyToManyField('api.FoodItem', through="OrderFoodQuantity")

    def __str__(self):
        return f"OrderItem #{self.id} for Order #{self.order.id}"

class FoodItem(models.Model):
    """
    A model representing individual edible items on the menu (e.g. Orange Chicken, Beijing Beef, etc)

    :param name: The name of the food item
    :param type: The type of the food item, with choices like "Entree", "Side", "Appetizer", "Dessert", or "Drink"
    :param alt_price: The alternative price for the food item which overrides any base price
    :param upcharge: The upcharge associated with the food item for premium items
    :param on_menu: A boolean flag indicating whether the food item is currently on the menu
    :param image: An image of the food item, uploaded to the 'food_images/' directory
    :param calories: The calorie count of the food item
    :param is_spicy: A boolean flag indicating if the food item is spicy
    :param is_premium: A boolean flag indicating if the food item is considered premium
    :param is_gluten_free: A boolean flag indicating if the food item is gluten-fre
    """

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
    """
    A model representing all different inventories items tracked by the restaurant.

    :param name: The name of the inventory item
    :param is_food: A boolean flag indicating whether the inventory item is edible
    :param stock: The number of units of the inventory item currently in stock
    :param restock_threshold: The stock level at which the inventory item should be restocked
    :param restock_amount: The amount to be restocked when the inventory item reaches the restock threshold
    """
    name = models.CharField(max_length=100)
    is_food = models.BooleanField()
    stock = models.IntegerField()
    restock_threshold = models.IntegerField()
    restock_amount = models.IntegerField()

    def __str__(self):
        return self.name

class FoodInventoryQuantity(models.Model):
    """
    A through model that associates how much of each inventory item a given food
    item uses when cooked.

    :param food_item: The food item associated with the inventory item
    :param inventory_item: The inventory item associated with the food item
    :param quantity: The quantity of the inventory item required for the corresponding food item
    """

    food_item = models.ForeignKey('api.FoodItem', on_delete=models.CASCADE)
    inventory_item = models.ForeignKey('api.InventoryItem', on_delete=models.CASCADE)
    quantity = models.IntegerField()
    
    # Ensures unique instances of food+inventory item combos
    class Meta:
        unique_together = ('food_item', 'inventory_item')

    def __str__(self):
        return f"{self.food_item} --> {self.inventory_item} : {self.quantity}"

class OrderFoodQuantity(models.Model):
    """
    A through model which associates an order item with a variable quantity of 
    a single food item.

    :param order_item: The order item associated with the food item
    :param food_item: The food item included in the order item
    :param quantity: The quantity of the food item in the order item, default is 1
    """
    order_item = models.ForeignKey('api.OrderItem', on_delete=models.CASCADE)
    food_item = models.ForeignKey('api.FoodItem', on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)

    class Meta:
        unique_together = ('order_item', 'food_item')

class SettingParameter(models.Model):
    """
    A model representing different page settings and their values.

    :param key: The key name of the setting parameter, must be unique
    :param value: The current value of the setting parameter
    :param default: The default value of the setting parameter
    """
    key = models.CharField(max_length=100, unique=True)
    value = models.TextField()
    default = models.TextField()

