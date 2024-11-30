from django.http import JsonResponse
from django.core import serializers
from rest_framework.views import APIView
from api.serializers import *
from api.models import *

class SettingsView(APIView):
    def get(self, request):
        objects = SettingParameter.objects.all()
        rawjson = SettingSerializer(objects, many=True).data

        # Format the dictionary to be more readable
        json = {}
        for setting in rawjson:
            json[setting["key"]] = setting["value"]
        return JsonResponse(json, safe=False)

    def post(self, request):
        pass
