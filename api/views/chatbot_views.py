"""
@module Views
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..ai_model import get_response  # Import your AI model function

class ChatBotView(APIView):
    """
    A Django Rest Framework API view to handle chatbot interactions.

    @class ChatBotView
    """
    def post(self, request):
        """
        Handles POST requests to process user queries and return chatbot responses.

        @method post
        @param {Request} request The HTTP request object containing the user query.
        @returns {Response} JSON response containing the chatbot's reply or error details.
        """
        try:
            user_query = request.data.get("query", "")
            if not user_query:
                return Response({"error": "Query is required."}, status=status.HTTP_400_BAD_REQUEST)

            # Get the chatbot's response
            bot_response = get_response(user_query)

            return Response({"response": bot_response}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"error": "An error occurred while processing the query.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
