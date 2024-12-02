# Generated by Django 5.0 on 2024-12-02 05:35

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Employee',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('name', models.CharField(max_length=100)),
                ('pin', models.CharField(default=1234, max_length=6)),
                ('is_manager', models.BooleanField(default=False)),
                ('wage', models.DecimalField(decimal_places=2, max_digits=10)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='FoodItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('type', models.CharField(choices=[('entree', 'Entree'), ('side', 'Side'), ('appetizer', 'Appetizer'), ('dessert', 'Dessert'), ('drink', 'Drink')], default='entree', max_length=100)),
                ('alt_price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('upcharge', models.DecimalField(decimal_places=2, max_digits=10)),
                ('on_menu', models.BooleanField()),
                ('image', models.ImageField(blank=True, null=True, upload_to='food_images/')),
                ('calories', models.IntegerField(blank=True, null=True)),
                ('is_spicy', models.BooleanField(default=False)),
                ('is_premium', models.BooleanField(default=False)),
                ('is_gluten_free', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='InventoryItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('is_food', models.BooleanField()),
                ('stock', models.IntegerField()),
                ('restock_threshold', models.IntegerField()),
                ('restock_amount', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='OrderItemType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('base_price', models.DecimalField(decimal_places=2, max_digits=10)),
            ],
        ),
        migrations.CreateModel(
            name='SettingParameter',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('key', models.CharField(max_length=100, unique=True)),
                ('value', models.TextField()),
                ('default', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='FoodInventoryQuantity',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.IntegerField()),
                ('food_item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.fooditem')),
                ('inventory_item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.inventoryitem')),
            ],
            options={
                'unique_together': {('food_item', 'inventory_item')},
            },
        ),
        migrations.AddField(
            model_name='fooditem',
            name='inventory_items',
            field=models.ManyToManyField(through='api.FoodInventoryQuantity', to='api.inventoryitem'),
        ),
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('customer_name', models.CharField(max_length=100)),
                ('date_created', models.DateTimeField()),
                ('date_processed', models.DateTimeField(null=True)),
                ('type', models.CharField(choices=[('here', 'Here'), ('togo', 'Togo')], default='here', max_length=100)),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('in_progress', 'In Progress'), ('completed', 'Completed'), ('cancelled', 'Cancelled')], default='pending', max_length=20)),
                ('total_price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('employee', models.ForeignKey(on_delete=django.db.models.deletion.RESTRICT, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='OrderFoodQuantity',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.IntegerField(default=1)),
                ('food_item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.fooditem')),
            ],
        ),
        migrations.CreateModel(
            name='OrderItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('food_items', models.ManyToManyField(through='api.OrderFoodQuantity', to='api.fooditem')),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='order_items', to='api.order')),
                ('order_item_type', models.ForeignKey(on_delete=django.db.models.deletion.RESTRICT, to='api.orderitemtype')),
            ],
        ),
        migrations.AddField(
            model_name='orderfoodquantity',
            name='order_item',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.orderitem'),
        ),
        migrations.AlterUniqueTogether(
            name='orderfoodquantity',
            unique_together={('order_item', 'food_item')},
        ),
    ]
