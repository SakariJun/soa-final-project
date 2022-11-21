@echo off
set /p venv=< python-venv-name.txt

start title Task-service ^& cd backend\task-service ^& mkvirtualenv %venv% ^& workon %venv% ^& pip install -r requirements.txt ^& python index.py
start title User-service ^& cd backend\user-service ^& npm i ^& node ./src/index.js
start title Department-service ^& cd backend\department-service ^& npm i ^& node ./src/index.js
start title Absence-service ^& cd backend\absence-service ^& npm i ^& node ./src/index.js