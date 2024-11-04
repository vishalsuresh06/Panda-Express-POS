from django.urls import path, include
from . import views

urlpatterns = [
    path('helloworld/', views.helloworld),
    path("employees/", views.EmployeeView.as_view(), name="employees"),
    path("menu/", views.MenuView.as_view(), name="menu"),
    path('orders/', views.getOrders),
]
