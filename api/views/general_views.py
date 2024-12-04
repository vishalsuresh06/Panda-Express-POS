from django.http import JsonResponse
from rest_framework import status
from rest_framework.views import APIView
from api.serializers import *
from api.models import *

class SettingsView(APIView):
    """
    Django view that handles all API request for page settings.
    """

    # Returns dictionary of all settings in the DB
    def get(self, request):
        """
        Returns a JSON containing all the page settings in the database.
        """

        objects = SettingParameter.objects.all()
        rawjson = SettingSerializer(objects, many=True).data

        # Flatten the {key, value} model pairs into a key: value dictionary
        json = {}
        for setting in rawjson:
            json[setting["key"]] = setting["value"]
        return JsonResponse(json, safe=False)

    # Updates a specific setting parameter to a new value
    def post(self, request):
        """
        Suppots two actions: set and restore. Set sets the target page setting to a passed argument. 
        Restore resets all page settings in the database to their designated default values.
        """

        action = request.data['action']

        if action == "set":
            field = request.data['field']
            data = request.data['data']

            print(f"Recieved: ({field}, {data})")

            try:
                settingparam = SettingParameter.objects.get(key=field)
                settingparam.value = data
                settingparam.save()
                return JsonResponse({"success":True}, status=status.HTTP_200_OK)
            except SettingParameter.DoesNotExist:
                return JsonResponse({"success":False}, status=status.HTTP_406_NOT_ACCEPTABLE)
        
        elif action == "restoredefaults":
            try:
                settingparams = SettingParameter.objects.all()
                for param in settingparams:
                    param.value = param.default
                    param.save()
                return JsonResponse({"success":True}, status=status.HTTP_200_OK)
            except SettingParameter.DoesNotExist:
                return JsonResponse({"success":False}, status=status.HTTP_406_NOT_ACCEPTABLE)
        
        else:
            return JsonResponse({"success":False}, status=status.HTTP_406_NOT_ACCEPTABLE)

