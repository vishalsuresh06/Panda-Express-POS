from django.core.management.base import BaseCommand
from backend.api.models import Employee, FoodItem, InventoryItem, Order

class Command(BaseCommand):
    help = 'Seed the database with initial data'

    def handle(self, *args, **kwargs):
        # Employees
        employee = Employee.objects.create(name='Bob China', password='ILovePandaExpress', is_manager=False, pay=12.00)
        employee.save()
        Employee.objects.create(name='John America', password='ILoveAmerica', is_manager=False, pay=7.50).save()
        Employee.objects.create(name='Chris Panda', password='ILovePandas', is_manager=True, pay=15.00).save()

        # Food Items
        FoodItem.objects.create(name='Orange Chicken', type="Entree", on_menu=True, alt_price=6.00, upcharge=0.00)
        FoodItem.objects.create(name='Beijing Beef', type="Entree", on_menu=True, alt_price=6.00, upcharge=0.00)

        InventoryItem.objects.create(name='Breaded Chicken', is_food=True, stock=1000, restock_threshold=500, restock_amount = 1000)
        InventoryItem.objects.create(name='Sliced Beef', is_food=True, stock=1000, restock_threshold=500, restock_amount = 1000)

        self.stdout.write(self.style.SUCCESS('Database seeded successfully'))
