from django.core.management.base import BaseCommand
from backend.api.models import Employee, FoodItem, InventoryItem, Order

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
        FoodItem.objects.create(name = 'Fried Rice', type="Side", on_menu = True, alt_price = NULL, upcharge = NULL).save()
        FoodItem.objects.create(name = 'Chow Mein', type="Side", on_menu = True, alt_price = NULL, upcharge = NULL).save()
        FoodItem.objects.create(name = 'Teriyaki Chicken', type="Entree", on_menu = True, alt_price = 6.00, upcharge = 0.00).save()
        FoodItem.objects.create(name = 'Broccoli Beef', type="Entree", on_menu = True, alt_price = 6.00, upcharge = 0.00).save()
        FoodItem.objects.create(name = 'Super Greens', type="Side", on_menu = True, alt_price = NULL, upcharge = NULL).save()
        FoodItem.objects.create(name = 'Rangoons', type="Appetizer", on_menu = True, alt_price = 2.00, upcharge = 0.00).save()
        FoodItem.objects.create(name = 'Fountain Drink', type="Drink", on_menu = True, alt_price = NULL, upcharge = NULL).save()
        FoodItem.objects.create(name = 'Bottled Water', type="Drink", on_menu = True, alt_price = 1.50, upcharge = 0.00).save()
        FoodItem.objects.create(name = 'Gatorade', type="Drink", on_menu = True, alt_price = 3.00, upcharge = 0.00).save()
        FoodItem.objects.create(name = 'Apple Pie Roll', type="Appetizer", on_menu = True, alt_price = 2.00, upcharge = 0.00).save()
        FoodItem.objects.create(name = 'Black Pepper Sirloin Steak', type="Entree", on_menu = True, alt_price = 6.00, upcharge = 1.50).save()
        FoodItem.objects.create(name = 'Honey Sesame Chicken Breast', type="Entree", on_menu = True, alt_price = 6.00, upcharge = 0.00).save()
        FoodItem.objects.create(name = 'Mushroom Chicken', type="Entree", on_menu = True, alt_price = 6.00, upcharge = 0.00).save()
        FoodItem.objects.create(name = 'Sweetfire Chicken Breast', type="Entree", on_menu = True, alt_price = 6.00, upcharge = 0.00).save()
        FoodItem.objects.create(name = 'String Bean Chicken Breast', type="Entree", on_menu = True, alt_price = 6.00, upcharge = 0.00).save()
        FoodItem.objects.create(name = 'White Steamed Rice', type="Side", on_menu = True, alt_price = 5.00, upcharge = 0.00).save()

        InventoryItem.objects.create(name='Breaded Chicken', is_food=True, stock=1000, restock_threshold=500, restock_amount = 1000).save()
        InventoryItem.objects.create(name='Sliced Beef', is_food=True, stock=1000, restock_threshold=500, restock_amount = 1000).save()

        self.stdout.write(self.style.SUCCESS('Database seeded successfully'))
