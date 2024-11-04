import random
from datetime import datetime, timedelta
from django.core.management.base import BaseCommand
from django.db import models 
from models import Employee, FoodItem, InventoryItem, Order, OrderItemType, OrderItem, FoodInventoryQuantity

class Command(BaseCommand):
    help = 'Populate the database with sample data'

    def handle(self, *args, **kwargs):
        # Create Employees
        for i in range(5):
            Employee.objects.get_or_create(
                name=f'Employee {i+1}',
                password='password123',
                is_manager=(i == 0),  # Make the first employee a manager
                pay=round(random.uniform(10.00, 25.00), 2)
            )

        # Create Food Items
        food_items = [
            {"name": "Orange Chicken", "type": "Entree", "alt_price": 7.50, "upcharge": 1.50, "on_menu": True},
            {"name": "Broccoli Beef", "type": "Entree", "alt_price": 6.50, "upcharge": 1.00, "on_menu": True},
            {"name": "Egg Roll", "type": "Appetizer", "alt_price": 1.25, "upcharge": 0.50, "on_menu": True}
        ]
        
        for food_item in food_items:
            FoodItem.objects.get_or_create(**food_item)

        # Create Inventory Items
        for i in range(3):
            InventoryItem.objects.get_or_create(
                name=f'Inventory Item {i+1}',
                is_food=True,
                stock=random.randint(50, 200),
                restock_threshold=20,
                restock_amount=50
            )

        # Create Order Item Types
        item_types = ["Dine-in", "Takeout", "Delivery"]
        for item_type in item_types:
            OrderItemType.objects.get_or_create(name=item_type, base_price=5.00)

        # Create Orders
        employees = Employee.objects.all()
        food_items = FoodItem.objects.all()
        order_item_types = OrderItemType.objects.all()

        for _ in range(10):
            order = Order.objects.create(
                date=datetime.now() - timedelta(days=random.randint(0, 30)),
                type=random.choice(item_types),
                total_price=round(random.uniform(20.00, 100.00), 2),
                employee=random.choice(employees),
                customer_name=f'Customer {_ + 1}'
            )
            
            # Add Order Items to the Order
            for _ in range(random.randint(1, 3)):
                order_item = OrderItem.objects.create(
                    order=order,
                    order_item_type=random.choice(order_item_types)
                )
                order_item.food_items.set(random.sample(list(food_items), random.randint(1, 2)))

        self.stdout.write(self.style.SUCCESS('Sample data populated successfully'))
