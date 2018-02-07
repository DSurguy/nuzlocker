deactivate || echo "no running env"
virtualenv .nuzlocker_env
. .nuzlocker_env/Scripts/activate
pip install Flask
FLASK_APP=nuzlocker.py
cd server
flask run