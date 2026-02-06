from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")
FROM_EMAIL = os.getenv("FROM_EMAIL")
