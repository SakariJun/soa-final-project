import os
from app import create_app, db
from app.models import Author, Book

envr = os.getenv("FLASK_CONFIG") or "development"
app = create_app(envr)

if __name__ == "__main__":
    app.run()
