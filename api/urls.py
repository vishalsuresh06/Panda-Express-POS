from django.urls import path, include
from api.views import cashier_views, kiosk_views, kitchen_views, manager_views, menu_views
from django.conf import settings
from django.conf.urls.static import static
from api.views.menu_views import MenuView


app_name = "api"

urlpatterns = [
    path("employees/", manager_views.EmployeeView.as_view(), name="employees"),
    path("menu/", MenuView.as_view(), name="menu"),
    path("inventory/", manager_views.InventoryView.as_view(), name="inventory"),
	  path("kitchen/orders", kitchen_views.KitchenOrders.as_view(), name="kitchenorders"),
	  path("kitchen/orderhistory", kitchen_views.OrderHistoryView.as_view(), name="orderhistory"),
      path("food-items/", MenuView.as_view(), name="food_items"),
    path("food-items/<int:pk>/", MenuView.as_view(), name="food_item_detail"),
    #path("api/food-items/", MenuView.as_view(), name="food_items"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
