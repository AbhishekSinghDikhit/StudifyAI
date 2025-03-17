import firebase_admin
from firebase_admin import credentials, auth
import logging
import time
import os
import jwt
import json
import base64
from dotenv import load_dotenv

load_dotenv()

firebase_b64 = os.getenv("FIREBASE_CONFIG_B64")

if firebase_b64:
    # Decode the base64 string and load JSON
    firebase_json = json.loads(base64.b64decode(firebase_b64).decode())

    # Initialize Firebase Admin SDK
    cred = credentials.Certificate(firebase_json)
    firebase_admin.initialize_app(cred)
else:
    raise ValueError("Firebase config not found in environment variables")

def verify_token(id_token):
    try:
        decoded_token = jwt.decode(
            id_token,
            key=os.getenv("API_KEY"),  # Replace with your actual key
            algorithms=["RS256"],
            options={"verify_exp": True, "verify_nbf": True},
            leeway=60  # Add 60 seconds of leeway
        )
        return decoded_token
    except jwt.ExpiredSignatureError:
        logging.error("Token expired")
    except jwt.InvalidTokenError as e:
        logging.error(f"Error verifying token: {e}")
    return None
