from django.urls import path, include
from api.views import cashier_views, kiosk_views, kitchen_views, manager_views, menu_views

urlpatterns = [
    path("employees/",  manager_views.EmployeeView.as_view(), name="employees"),
    path("menu/",       manager_views.MenuView.as_view(), name="menu"),
	path("kitchen/orders", kitchen_views.KitchenOrders.as_view(), name="kitchenorders"),
	path("kitchen/orderhistory", kitchen_views.OrderHistoryView.as_view(), name="orderhistory"),
]
