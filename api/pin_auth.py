from django.contrib.auth.backends import BaseBackend
from api.models import Employee

class PinAuthenticationBackend(BaseBackend):
    def authenticate(self, request, id=None, pin=None):
        try:
            employee = Employee.objects.get(id=id, pin=pin)
            if employee.is_active:
                return employee
        except Employee.DoesNotExist:
            return None

    def get_user(self, id):
        try:
            return Employee.objects.get(pk=id)
        except Employee.DoesNotExist:
            return None
