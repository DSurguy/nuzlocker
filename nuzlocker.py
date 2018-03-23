import datetime
import os
import json

from MockDBHelper import MockDBHelper as DBHelper
from app.passwordhalper import PasswordHelper
from flask import Flask, request, send_from_directory, url_for, redirect
from flask import jsonify
from flask_login import LoginManager, login_user, logout_user, current_user
from app.runstatemanager import RunStateManager
from app.user import User
from models.encounter import Encounter
from models.pokemon import Pokemon
from models.route import Route
from cache.InMemoryCache import InMemoryCache, CacheEntry

app = Flask(__name__, static_folder='dist/public')
app.secret_key = 'IniR3SCXKFhl87zICvxDWFG5BGxE9GC903V4jXkn7UzO1MwMuwh6ipwVca++yoQZTgUP/V0Nwrp4WyFwdrclGbonOeSbzBQhFEJp'
login_manager = LoginManager(app)
DB = DBHelper()
PH = PasswordHelper()
SM = RunStateManager()

# Temporarily load from a static json file for development
with open('tests/sampleData.json') as in_file:
    data = json.load(in_file)

pokemon_cache = InMemoryCache(20, lambda x: CacheEntry(x, Pokemon(data['pokemon'][x])))
route_cache = InMemoryCache(100, lambda x: CacheEntry(x, Route(data['routes'][x])))

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if(path == ""):
        return send_from_directory("dist/public/", "index.html")
    else:
        if(os.path.exists("dist/public/" + path)):
            return send_from_directory("dist/public", path)
        else:
            return send_from_directory("dist/public", 'index.html')

@app.route("/api/v1/encounter", methods=['POST'])
def api_add_encounter():
    data = request.get_json()
    run_id = data.get('runId')
    route_id = data.get('routeId')
    pokemon_data = data.get('pokemon')
    outcome = data.get('outcome')
    pokemon_id = pokemon_data.get('id')
    encounter = Encounter.new(route_id, outcome, pokemon_id, pokemon_data.get('metadata'))
    success = SM.add_encounter(run_id, current_user.get_id(), encounter)
    # success = DB.add_encounter(current_user.get_id(), run_id, encounter)
    return json.dumps(success), 200 if success['success'] else 400, {'ContentType': 'application/json'}

@app.route("/api/v1/encounters/<run_id>")
def api_get_encounters(run_id):
    return jsonify(DB.get_encounters(current_user.get_id(), int(run_id)))

@app.route("/api/v1/state/<run_id>")
def api_get_state(run_id):
    return jsonify(SM.get_current_state(current_user.get_id(), int(run_id)).to_dict())

@app.route("/pokemon/<pokemonId>")
def pokemonInfo(pokemonId):
    return jsonify(pokemon_cache.get(int(pokemonId)).asJson())

@app.route("/api/v1/route/<routeId>")
def api_route_info(routeId):
    return jsonify(DB.get_route(int(routeId)))
    # return jsonify(route_cache.get(int(routeId)).asJson())

@app.route("/login", methods=['POST'])
def login():
    # email = request.form.get('email')
    # password = request.form.get('password')
    email = 'test@example.com'
    password = '123456'
    stored_user = DB.get_user(email)
    if stored_user and PH.validate_password(password, stored_user['salt'], stored_user['hashed']):
        user = User(email)
        login_user(user, remember=True)
        return "OK"
    return "FAIL"


@app.route("/logout")
def logout():
    logout_user()
    return "OK"

@app.route("/routes")
def routes():
    return jsonify(route_cache.statusMap())

@app.route("/pokemon", methods=['GET'])
def displayAll():
    return jsonify(pokemon_cache.statusMap())


@login_manager.user_loader
def load_user(user_id):
    user_password = DB.get_user(user_id)
    if user_password:
        return User(user_id)

if __name__ == '__main__':
    app.run(use_reloader=True, port=5000, threaded=True)