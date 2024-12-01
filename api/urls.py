from django.urls import path, include
from api.views import cashier_views, kiosk_views, kitchen_views, manager_views, menu_views, general_views

urlpatterns = [
    path("employees/", manager_views.EmployeeView.as_view(), name="employees"),
    path("menu/", manager_views.MenuView.as_view(), name="menu"),
    path("inventory/", manager_views.InventoryView.as_view(), name="inventory"),
    path('manager/menu-query/<int:id>', manager_views.menuQueryView, name='menuquery'),
    path('manager/inventory-query/<int:id>', manager_views.inventoryQueryView, name='inventoryquery'),
	path("kitchen/orders", kitchen_views.KitchenOrders.as_view(), name="kitchenorders"),
	path("kitchen/recentorders", kitchen_views.RecentOrdersView.as_view(), name="recentorders"),
	path("settings", general_views.SettingsView.as_view(), name="settings"),
	path("manager/excess", manager_views.ExcessView.as_view(), name="excess"),
	path("manager/sellstogether", manager_views.SellsTogetherView.as_view(), name="sellstogether"),
	path("manager/restock", manager_views.RestockView.as_view(), name="restock"),
]
