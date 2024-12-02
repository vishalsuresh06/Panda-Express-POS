from django.core.management.base import BaseCommand
from api.models import Employee, FoodItem, InventoryItem, Order, OrderItemType, OrderItem, FoodInventoryQuantity
from django.utils import timezone
import datetime
import random


class Command(BaseCommand):
    help = 'Seed the database with initial data'

    def handle(self, *args, **kwargs):
        # Employees
        employee1 = Employee.objects.create(name='Bob China', password='ILovePandaExpress', is_manager=False, wage=12.00)
        employee2 = Employee.objects.create(name='John America', password='ILoveAmerica', is_manager=False, wage=7.50)
        employee3 = Employee.objects.create(name='Chris Panda', password='ILovePandas', is_manager=True, wage=15.00)

        food_items_data = [
            {'name': 'Orange Chicken', 'type': "entree", 'on_menu': True, 'alt_price': 6.00, 'upcharge': 0.00, 'image': 'food_images/orangechicken.PNG', 'calories': 490, 'is_spicy': True, 'is_premium': False, 'is_gluten_free': False},
            {'name': 'Beijing Beef', 'type': "entree", 'on_menu': True, 'alt_price': 6.00, 'upcharge': 0.00, 'image': 'food_images/beijing_beef.PNG', 'calories': 470, 'is_spicy': True, 'is_premium': False, 'is_gluten_free': False},
            {'name': 'Broccoli Beef', 'type': "entree", 'on_menu': True, 'alt_price': 6.00, 'upcharge': 0.00, 'image': 'food_images/broccoli_beef.PNG', 'calories': 150, 'is_spicy': False, 'is_premium': False, 'is_gluten_free': True},
            {'name': 'Egg Roll', 'type': "appetizer", 'on_menu': True, 'alt_price': 2.00, 'upcharge': 0.00, 'image': 'food_images/chicken_egg_roll.PNG', 'calories': 200, 'is_spicy': False, 'is_premium': False, 'is_gluten_free': False},
            {'name': 'Kung Pao Chicken', 'type': "entree", 'on_menu': True, 'alt_price': 6.00, 'upcharge': 0.00, 'image': 'food_images/kung_pao_chicken.PNG', 'calories': 290, 'is_spicy': True, 'is_premium': False, 'is_gluten_free': False},
            {'name': 'Honey Walnut Shrimp', 'type': "entree", 'on_menu': True, 'alt_price': 6.00, 'upcharge': 1.50, 'image': 'food_images/honey_walnut_shrimp.PNG', 'calories': 360, 'is_spicy': False, 'is_premium': True, 'is_gluten_free': False},
            {'name': 'Chow Mein', 'type': "side", 'on_menu': True, 'alt_price': 3.50, 'upcharge': 0.00, 'image': 'food_images/chow_mein.PNG', 'calories': 510, 'is_spicy': False, 'is_premium': False, 'is_gluten_free': False},
            {'name': 'Fried Rice', 'type': "side", 'on_menu': True, 'alt_price': 3.50, 'upcharge': 0.00, 'image': 'food_images/fried_rice.PNG', 'calories': 520, 'is_spicy': False, 'is_premium': False, 'is_gluten_free': False},
            {'name': 'Super Greens', 'type': "side", 'on_menu': True, 'alt_price': 3.50, 'upcharge': 0.00, 'image': 'food_images/super_greens.PNG', 'calories': 170, 'is_spicy': False, 'is_premium': False, 'is_gluten_free': True},
            {'name': 'Veggie Spring Roll', 'type': "appetizer", 'on_menu': True, 'alt_price': 2.00, 'upcharge': 0.00, 'image': 'food_images/veggie_spring_roll.PNG', 'calories': 190, 'is_spicy': False, 'is_premium': False, 'is_gluten_free': False},
            {'name': 'Sweetfire Chicken Breast', 'type': "entree", 'on_menu': True, 'alt_price': 6.00, 'upcharge': 0.00, 'image': 'food_images/sweetfire_chicken.PNG', 'calories': 380, 'is_spicy': True, 'is_premium': False, 'is_gluten_free': False},
            {'name': 'Grilled Teriyaki Chicken', 'type': "entree", 'on_menu': True, 'alt_price': 6.00, 'upcharge': 0.00, 'image': 'food_images/teriyaki_chicken.PNG', 'calories': 300, 'is_spicy': False, 'is_premium': False, 'is_gluten_free': False},
            {'name': 'Black Pepper Steak', 'type': "entree", 'on_menu': True, 'alt_price': 7.00, 'upcharge': 1.50, 'image': 'food_images/black_pepper_steak.PNG', 'calories': 400, 'is_spicy': True, 'is_premium': True, 'is_gluten_free': False},
            {'name': 'Rangoons', 'type': "appetizer", 'on_menu': True, 'alt_price': 2.00, 'upcharge': 0.00, 'image': 'food_images/cream_cheese_rangoon.PNG', 'calories': 190, 'is_spicy': False, 'is_premium': False, 'is_gluten_free': False},
            {'name': 'Fountain Drink', 'type': "drink", 'on_menu': True, 'alt_price': 0.00, 'upcharge': 0.00, 'image': 'food_images/fountain_drink.png', 'calories': 0, 'is_spicy': False, 'is_premium': False, 'is_gluten_free': True},
            {'name': 'Bottled Water', 'type': "drink", 'on_menu': True, 'alt_price': 1.50, 'upcharge': 0.00, 'image': 'food_images/water.png', 'calories': 0, 'is_spicy': False, 'is_premium': False, 'is_gluten_free': True},
            {'name': 'Gatorade', 'type': "drink", 'on_menu': True, 'alt_price': 3.00, 'upcharge': 0.00, 'image': 'food_images/gatorade.png', 'calories': 140, 'is_spicy': False, 'is_premium': False, 'is_gluten_free': True},
            {'name': 'Apple Pie Roll', 'type': "appetizer", 'on_menu': True, 'alt_price': 2.00, 'upcharge': 0.00, 'image': 'food_images/apple_pie_roll.png', 'calories': 300, 'is_spicy': False, 'is_premium': False, 'is_gluten_free': False},
            {'name': 'Honey Sesame Chicken Breast', 'type': "entree", 'on_menu': True, 'alt_price': 6.00, 'upcharge': 0.00, 'image': 'food_images/honey_sesame_chicken.PNG', 'calories': 420, 'is_spicy': False, 'is_premium': False, 'is_gluten_free': False},
            {'name': 'Mushroom Chicken', 'type': "entree", 'on_menu': True, 'alt_price': 6.00, 'upcharge': 0.00, 'image': 'food_images/mushroom_chicken.PNG', 'calories': 170, 'is_spicy': False, 'is_premium': False, 'is_gluten_free': False},
            {'name': 'String Bean Chicken Breast', 'type': "entree", 'on_menu': True, 'alt_price': 6.00, 'upcharge': 0.00, 'image': 'food_images/string_bean_chicken.PNG', 'calories': 190, 'is_spicy': False, 'is_premium': False, 'is_gluten_free': True},
            {'name': 'White Steamed Rice', 'type': "side", 'on_menu': True, 'alt_price': 5.00, 'upcharge': 0.00, 'image': 'food_images/white_rice.PNG', 'calories': 380, 'is_spicy': False, 'is_premium': False, 'is_gluten_free': True},
        ]

        for food_item in food_items_data:
            FoodItem.objects.create(**food_item)

        #inventory
        breadedchicken = InventoryItem.objects.create(name='Breaded Chicken', is_food=True, stock=1000, restock_threshold=500, restock_amount = 1000)
        InventoryItem.objects.create(name='Sliced Beef', is_food=True, stock=1000, restock_threshold=500, restock_amount = 1000)
        InventoryItem.objects.create(name='Rice', is_food=True, stock=1000, restock_threshold=800, restock_amount = 2000)
        InventoryItem.objects.create(name='Noodles', is_food=True, stock=1000, restock_threshold=800, restock_amount = 2000)
        InventoryItem.objects.create(name='Orange Sauce', is_food=True, stock=1000, restock_threshold=800, restock_amount = 2000)
        InventoryItem.objects.create(name='Kung Pao Sauce', is_food=True, stock=1000, restock_threshold=800, restock_amount = 2000)
        InventoryItem.objects.create(name='Soy Sauce', is_food=True, stock=1000, restock_threshold=800, restock_amount = 2000)
        InventoryItem.objects.create(name='Teriyaki Sauce', is_food=True, stock=1000, restock_threshold=800, restock_amount = 2000)
        InventoryItem.objects.create(name='Eggrolls', is_food=True, stock=1000, restock_threshold=800, restock_amount = 2000)
        InventoryItem.objects.create(name='Vegetable Mix', is_food=True, stock=1000, restock_threshold=800, restock_amount = 2000)
        InventoryItem.objects.create(name='Rangoons', is_food=True, stock=1000, restock_threshold=800, restock_amount = 2000)
        InventoryItem.objects.create(name='Sweet and Sour Sauce', is_food=True, stock=583, restock_threshold=800, restock_amount = 2000)
        InventoryItem.objects.create(name='Shrimp', is_food=True, stock=987, restock_threshold=800, restock_amount = 2000)
        InventoryItem.objects.create(name='Walnuts', is_food=True, stock=1048, restock_threshold=800, restock_amount=2000)
        InventoryItem.objects.create(name='Peanuts', is_food=True, stock=496, restock_threshold=800, restock_amount=2000)
        InventoryItem.objects.create(name='Egg', is_food=True, stock=490, restock_threshold=800, restock_amount=2000)
        InventoryItem.objects.create(name='Oil', is_food=True, stock=1090, restock_threshold=800, restock_amount=2000)
        InventoryItem.objects.create(name='Togo Box', is_food=False, stock=493, restock_threshold=800, restock_amount=2000)
        InventoryItem.objects.create(name='Bowl', is_food=False, stock=385, restock_threshold=800, restock_amount=2000)
        InventoryItem.objects.create(name='Plate', is_food=False, stock=950, restock_threshold=800, restock_amount=2000)
        InventoryItem.objects.create(name='Bigger Plate', is_food=False, stock=400, restock_threshold=800, restock_amount=2000)
        InventoryItem.objects.create(name='Fountain Drink Cup', is_food=False, stock=100, restock_threshold=800, restock_amount=2000)
        InventoryItem.objects.create(name='Water Bottle', is_food=True, stock=600, restock_threshold=800, restock_amount=2000)
        InventoryItem.objects.create(name='Chicken Breast', is_food=True, stock=400, restock_threshold=800, restock_amount=2000)
        InventoryItem.objects.create(name='Apple Pie Roll', is_food=True, stock=300, restock_threshold=800, restock_amount=2000)
        InventoryItem.objects.create(name='Gatorade Bottle', is_food=True, stock=498, restock_threshold=800, restock_amount=2000)
        InventoryItem.objects.create(name='Mushrooms', is_food=True, stock=498, restock_threshold=800, restock_amount=2000)
        
        order_item_types = [
            ("Bowl", 8.30),
            ("Plate", 9.80),
            ("Cub Meal", 6.60),
            ("Family Feast", 43.00),
            ("Bigger Plate", 11.30),
            ("A La Carte", 7.40),
            
        ]
        for name, base_price in order_item_types:
            item_type = OrderItemType.objects.create(name=name, base_price=base_price)

         # Generate Dates
        start_date = datetime.datetime(2023, 1, 1)
        end_date = datetime.datetime(2023, 12, 31)
        total_days = (end_date - start_date).days + 1
        dates = [start_date + datetime.timedelta(days=i) for i in range(total_days)]

        # Set peak days and sales targets
        peak_days = random.sample(dates, 2)
        total_sales_target = 1_000_000
        uniform_sales = total_sales_target / total_days
        peak_sales = uniform_sales * 10

        # Generate Orders
        order_id = 0
        current_sales = 0

        def create_order(date, sales_limit):
            nonlocal order_id, current_sales
            while current_sales < sales_limit:
                employee = random.choice([employee1, employee2])
                order_total = round(random.uniform(10, 100), 2)
                current_sales += order_total

                # Create order
                order = Order.objects.create(
                    customer_name=f'Customer {order_id}',
                    employee=employee,
                    date=date,
                    type=random.choice(['here', 'togo']),
                    status=random.choices([Order.PENDING, Order.COMPLETED], [1, 10])[0],
                    total_price=order_total
                )
                
                order_id += 1

                # Create Order Items
                for _ in range(random.randint(1, 3)):  # Random number of order items
                    item_type = random.choice(OrderItemType.objects.all())

                    order_item = OrderItem.objects.create(
                        order=order,
                        order_item_type = item_type
                    )

                    # Add food items to the ManyToManyField
                    food_items = random.sample(list(FoodItem.objects.all()), random.randint(1, 3))
                    order_item.food_items.set(food_items)

        # Add seeding logic for FoodInventoryQuantity
        for food_item in FoodItem.objects.all():
            for inventory_item in InventoryItem.objects.filter(is_food=True):  # Example filter
                FoodInventoryQuantity.objects.create(
                    food_item=food_item,
                    inventory_item=inventory_item,
                    quantity=random.randint(1, 10)  # Set a random quantity
                )


        # Generate spike day orders
        for date in peak_days:
            create_order(date, peak_sales)

        # Generate normal day orders
        for date in dates:
            if date not in peak_days:
                create_order(date, uniform_sales)


        self.stdout.write(self.style.SUCCESS('Database seeded successfully'))