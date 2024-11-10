from django.core.management.base import BaseCommand
from api.models import Employee, FoodItem, InventoryItem, Order, OrderItemType, OrderItem
from django.utils import timezone
from datetime import timedelta
import random


class Command(BaseCommand):
    help = 'Seed the database with initial data'

    def handle(self, *args, **kwargs):
        # Employees
        employee = Employee.objects.create(name='Bob China', password='ILovePandaExpress', is_manager=False, wage=12.00)
        employee.save()
        Employee.objects.create(name='John America', password='ILoveAmerica', is_manager=False, wage=7.50).save()
        Employee.objects.create(name='Chris Panda', password='ILovePandas', is_manager=True, wage=15.00).save()

        # Food Items
        FoodItem.objects.create(name='Orange Chicken', type="Entree", on_menu=True, alt_price=6.00, upcharge=0.00).save()
        FoodItem.objects.create(name='Beijing Beef', type="Entree", on_menu=True, alt_price=6.00, upcharge=0.00).save()
        FoodItem.objects.create(name = 'Broccoli Beef', type="Entree", on_menu = True, alt_price = 6.00, upcharge = 0.00).save()
        FoodItem.objects.create(name = 'Egg Roll', type="Appetizer", on_menu = True, alt_price = 2.00, upcharge = 0.00).save()
        FoodItem.objects.create(name = 'Kung Pao Chicken', type="Entree", on_menu = True, alt_price = 6.00, upcharge = 0.00).save()
        FoodItem.objects.create(name = 'Honey Walnut Shrimp', type="Entree", on_menu = True, alt_price = 6.00, upcharge = 1.50).save()
        FoodItem.objects.create(name = 'Fried Rice', type="Side", on_menu = True, alt_price = None, upcharge = None).save()
        FoodItem.objects.create(name = 'Chow Mein', type="Side", on_menu = True, alt_price = None, upcharge = None).save()
        FoodItem.objects.create(name = 'Teriyaki Chicken', type="Entree", on_menu = True, alt_price = 6.00, upcharge = 0.00).save()
        FoodItem.objects.create(name = 'Broccoli Beef', type="Entree", on_menu = True, alt_price = 6.00, upcharge = 0.00).save()
        FoodItem.objects.create(name = 'Super Greens', type="Side", on_menu = True, alt_price = None, upcharge = None).save()
        FoodItem.objects.create(name = 'Rangoons', type="Appetizer", on_menu = True, alt_price = 2.00, upcharge = 0.00).save()
        FoodItem.objects.create(name = 'Fountain Drink', type="Drink", on_menu = True, alt_price = None, upcharge = None).save()
        FoodItem.objects.create(name = 'Bottled Water', type="Drink", on_menu = True, alt_price = 1.50, upcharge = 0.00).save()
        FoodItem.objects.create(name = 'Gatorade', type="Drink", on_menu = True, alt_price = 3.00, upcharge = 0.00).save()
        FoodItem.objects.create(name = 'Apple Pie Roll', type="Appetizer", on_menu = True, alt_price = 2.00, upcharge = 0.00).save()
        FoodItem.objects.create(name = 'Black Pepper Sirloin Steak', type="Entree", on_menu = True, alt_price = 6.00, upcharge = 1.50).save()
        FoodItem.objects.create(name = 'Honey Sesame Chicken Breast', type="Entree", on_menu = True, alt_price = 6.00, upcharge = 0.00).save()
        FoodItem.objects.create(name = 'Mushroom Chicken', type="Entree", on_menu = True, alt_price = 6.00, upcharge = 0.00).save()
        FoodItem.objects.create(name = 'Sweetfire Chicken Breast', type="Entree", on_menu = True, alt_price = 6.00, upcharge = 0.00).save()
        FoodItem.objects.create(name = 'String Bean Chicken Breast', type="Entree", on_menu = True, alt_price = 6.00, upcharge = 0.00).save()
        FoodItem.objects.create(name = 'White Steamed Rice', type="Side", on_menu = True, alt_price = 5.00, upcharge = 0.00).save()

        #inventory
        InventoryItem.objects.create(name='Breaded Chicken', is_food=True, stock=1000, restock_threshold=500, restock_amount = 1000).save()
        InventoryItem.objects.create(name='Sliced Beef', is_food=True, stock=1000, restock_threshold=500, restock_amount = 1000).save()
        InventoryItem.objects.create(name='Rice', is_food=True, stock=1000, restock_threshold=800, restock_amount = 2000).save()
        InventoryItem.objects.create(name='Noodles', is_food=True, stock=1000, restock_threshold=800, restock_amount = 2000).save()
        InventoryItem.objects.create(name='Orange Sauce', is_food=True, stock=1000, restock_threshold=800, restock_amount = 2000).save()
        InventoryItem.objects.create(name='Kung Pao Sauce', is_food=True, stock=1000, restock_threshold=800, restock_amount = 2000).save()
        InventoryItem.objects.create(name='Soy Sauce', is_food=True, stock=1000, restock_threshold=800, restock_amount = 2000).save()
        InventoryItem.objects.create(name='Teriyaki Sauce', is_food=True, stock=1000, restock_threshold=800, restock_amount = 2000).save()
        InventoryItem.objects.create(name='Eggrolls', is_food=True, stock=1000, restock_threshold=800, restock_amount = 2000).save()
        InventoryItem.objects.create(name='Vegetable Mix', is_food=True, stock=1000, restock_threshold=800, restock_amount = 2000).save()
        InventoryItem.objects.create(name='Rangoons', is_food=True, stock=1000, restock_threshold=800, restock_amount = 2000).save()
        InventoryItem.objects.create(name='Sweet and Sour Sauce', is_food=True, stock=583, restock_threshold=800, restock_amount = 2000).save()
        InventoryItem.objects.create(name='Shrimp', is_food=True, stock=987, restock_threshold=800, restock_amount = 2000).save()
        InventoryItem.objects.create(name='Walnuts', is_food=True, stock=1048, restock_threshold=800, restock_amount=2000).save()
        InventoryItem.objects.create(name='Peanuts', is_food=True, stock=496, restock_threshold=800, restock_amount=2000).save()
        InventoryItem.objects.create(name='Egg', is_food=True, stock=490, restock_threshold=800, restock_amount=2000).save()
        InventoryItem.objects.create(name='Oil', is_food=True, stock=1090, restock_threshold=800, restock_amount=2000).save()
        InventoryItem.objects.create(name='Togo Box', is_food=False, stock=493, restock_threshold=800, restock_amount=2000).save()
        InventoryItem.objects.create(name='Bowl', is_food=False, stock=385, restock_threshold=800, restock_amount=2000).save()
        InventoryItem.objects.create(name='Plate', is_food=False, stock=950, restock_threshold=800, restock_amount=2000).save()
        InventoryItem.objects.create(name='Bigger Plate', is_food=False, stock=400, restock_threshold=800, restock_amount=2000).save()
        InventoryItem.objects.create(name='Fountain Drink Cup', is_food=False, stock=100, restock_threshold=800, restock_amount=2000).save()
        InventoryItem.objects.create(name='Water Bottle', is_food=True, stock=600, restock_threshold=800, restock_amount=2000).save()
        InventoryItem.objects.create(name='Chicken Breast', is_food=True, stock=400, restock_threshold=800, restock_amount=2000).save()
        InventoryItem.objects.create(name='Apple Pie Roll', is_food=True, stock=300, restock_threshold=800, restock_amount=2000).save()
        InventoryItem.objects.create(name='Gatorade Bottle', is_food=True, stock=498, restock_threshold=800, restock_amount=2000).save()
        InventoryItem.objects.create(name='Mushrooms', is_food=True, stock=498, restock_threshold=800, restock_amount=2000).save()

        


        self.stdout.write(self.style.SUCCESS('Database seeded successfully'))
