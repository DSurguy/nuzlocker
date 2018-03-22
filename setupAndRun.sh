deactivate || echo "no running env"
virtualenv .nuzlocker_env
. .nuzlocker_env/Scripts/activate
pip install Flask
pip install flask-cors
FLASK_APP=nuzlocker.py
python nuzlocker.py