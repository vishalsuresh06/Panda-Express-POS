from django.urls import path, include
from api.views import cashier_views, kiosk_views, kitchen_views, manager_views, menu_views

urlpatterns = [
    path("employees/",  manager_views.EmployeeView.as_view(), name="employees"),
    path("menu/",       manager_views.MenuView.as_view(), name="menu"),
    path("kiosk_menu/",   kiosk_views.KioskView.as_view(), name = "Kiosk_menu"),
    path("inventory/", manager_views.InventoryView.as_view(), name="inventory"),
	path("kitchen/orders", kitchen_views.KitchenOrders.as_view(), name="kitchenorders"),
	path("kitchen/recentorders", kitchen_views.RecentOrdersView.as_view(), name="recentorders"),
]
