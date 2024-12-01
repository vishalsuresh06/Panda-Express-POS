from django.core.management.base import BaseCommand
from api.models import Employee, FoodItem, InventoryItem, Order, OrderItemType, OrderItem, FoodInventoryQuantity, SettingParameter
from django.utils import timezone
import datetime
import random
import pytz


# IMPORTANT: Both fields must be STRINGS
DEFAULT_SETTINGS = {
    "kt_refreshRate": "5",
    "kt_fullOrderCount": "2",
    "kt_recentOrderCount": "10",
    "kt_hereOrdersLeft": "true",
    "kt_tempUnits": "F",
    "kt_pendingColor": "#969696",
    "kt_inprogressColor": "#ffff64",
    "kt_completedColor": "#1dc871",
    "kt_cancelledColor": "#b46471",
}


class Command(BaseCommand):
    help = 'Seed the database with initial data'

    def handle(self, *args, **kwargs):
        
        # Load default settings
        for key,value in DEFAULT_SETTINGS.items():
            SettingParameter.objects.create(key=key, value=value, default=value)


        # Employees
        employee1 = Employee.objects.create(name='Bob China', password='ILovePandaExpress', is_manager=False, wage=12.00)
        employee2 = Employee.objects.create(name='John America', password='ILoveAmerica', is_manager=False, wage=7.50)
        employee3 = Employee.objects.create(name='Chris Panda', password='ILovePandas', is_manager=True, wage=15.00)

        # Food Items
        FoodItem.objects.create(name='Orange Chicken', type="Entree", on_menu=True, alt_price=6.00, upcharge=0.00)
        FoodItem.objects.create(name='Beijing Beef', type="Entree", on_menu=True, alt_price=6.00, upcharge=0.00)
        FoodItem.objects.create(name='Broccoli Beef', type="Entree", on_menu=True, alt_price=6.00, upcharge=0.00)
        FoodItem.objects.create(name='Egg Roll', type="Appetizer", on_menu=True, alt_price=2.00, upcharge=0.00)
        FoodItem.objects.create(name='Kung Pao Chicken', type="Entree", on_menu=True, alt_price=6.00, upcharge=0.00)
        FoodItem.objects.create(name='Honey Walnut Shrimp', type="Entree", on_menu=True, alt_price=6.00, upcharge=1.50)
        FoodItem.objects.create(name='Fried Rice', type="Side", on_menu=True, alt_price=0.00, upcharge=0.00)
        FoodItem.objects.create(name='Chow Mein', type="Side", on_menu=True, alt_price=0.00, upcharge=0.00)
        FoodItem.objects.create(name='Teriyaki Chicken', type="Entree", on_menu=True, alt_price=6.00, upcharge=0.00)
        FoodItem.objects.create(name='Super Greens', type="Side", on_menu=True, alt_price=0.00, upcharge=0.00)
        FoodItem.objects.create(name='Rangoons', type="Appetizer", on_menu=True, alt_price=2.00, upcharge=0.00)
        FoodItem.objects.create(name='Fountain Drink', type="Drink", on_menu=True, alt_price=0.00, upcharge=0.00)
        FoodItem.objects.create(name='Bottled Water', type="Drink", on_menu=True, alt_price=1.50, upcharge=0.00)
        FoodItem.objects.create(name='Gatorade', type="Drink", on_menu=True, alt_price=3.00, upcharge=0.00)
        FoodItem.objects.create(name='Apple Pie Roll', type="Appetizer", on_menu=True, alt_price=2.00, upcharge=0.00)
        FoodItem.objects.create(name='Black Pepper Sirloin Steak', type="Entree", on_menu=True, alt_price=6.00, upcharge=1.50)
        FoodItem.objects.create(name='Honey Sesame Chicken Breast', type="Entree", on_menu=True, alt_price=6.00, upcharge=0.00)
        FoodItem.objects.create(name='Mushroom Chicken', type="Entree", on_menu=True, alt_price=6.00, upcharge=0.00)
        FoodItem.objects.create(name='Sweetfire Chicken Breast', type="Entree", on_menu=True, alt_price=6.00, upcharge=0.00)
        FoodItem.objects.create(name='String Bean Chicken Breast', type="Entree", on_menu=True, alt_price=6.00, upcharge=0.00)
        FoodItem.objects.create(name='White Steamed Rice', type="Side", on_menu=True, alt_price=5.00, upcharge=0.00)


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
            
        ]
        for name, base_price in order_item_types:
            item_type = OrderItemType.objects.create(name=name, base_price=base_price)

        # Generate Dates
        timezone = pytz.timezone('America/Chicago')
        start_date = timezone.localize(datetime.datetime(2023, 1, 1))
        end_date = timezone.localize(datetime.datetime(2023, 12, 31))
        total_days = (end_date - start_date).days + 1
        dates = [start_date + datetime.timedelta(days=i) for i in range(total_days)]
        critical_date = dates[-1] # Orders before this date have been completed, otherwise pending
        print(critical_date)

        # Set peak days and sales targets
        peak_days = random.sample(dates, 2)
        total_sales_target = 100_000
        uniform_sales = total_sales_target / total_days
        peak_sales = uniform_sales * 10

        # Generate Orders
        order_id = 0

        def create_order(date, sales_limit):
            print(date, sales_limit)

            nonlocal order_id

            current_sales = 0
            while current_sales < sales_limit:
                employee = random.choice([employee1, employee2])
                order_total = round(random.uniform(10, 100), 2)
                current_sales += order_total

                # Create order
                noisy_date = date + datetime.timedelta(hours=random.randint(0, 23),
                                                        minutes=random.randint(0,59),
                                                        seconds=random.randint(0,59))
                order = Order.objects.create(
                    customer_name=f'Customer {order_id}',
                    employee=employee,
                    date_created=noisy_date,
                    date_processed=noisy_date,  # For now, all seeded orders process instantly
                    type=random.choice(['here', 'togo']),
                    status=(Order.PENDING if noisy_date >= critical_date else Order.COMPLETED),
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



        

	

