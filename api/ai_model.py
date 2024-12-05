"""
@module api
"""

import openai
import os
from dotenv import load_dotenv


"""
Loads environment variables from a .env file to configure the OpenAI API key.

@function load_dotenv
@returns None
"""
load_dotenv()

"""
Sets the OpenAI API key using an environment variable.

@variable openai.api_key
"""
openai.api_key = os.getenv("OPENAI_API_KEY")

def get_response(prompt):
    """
    Sends a user prompt to the OpenAI GPT model and retrieves the AI-generated response.

    @function get_response
    @param {str} prompt The user input or query to send to the AI model.
    @returns {str} The AI-generated response to the user prompt.
    """
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
    )
    return response['choices'][0]['message']['content']
