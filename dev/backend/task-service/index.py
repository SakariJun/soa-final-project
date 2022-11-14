import os
from app import create_app, db

envr = os.getenv("FLASK_CONFIG") or "development"
app = create_app(envr)

if __name__ == "__main__":
    app.run()
