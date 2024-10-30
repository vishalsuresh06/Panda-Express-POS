from django.urls import path, include
from . import views

urlpatterns = [
    path('helloworld/', views.helloworld),
]
