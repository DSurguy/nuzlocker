import datetime
import os
import json

from MockDBHelper import MockDBHelper as DBHelper
from flask import Flask, request, send_from_directory
from flask import jsonify
from flask_cors import CORS
from models.encounter import Encounter
from models.pokemon import Pokemon
from models.route import Route
from cache.InMemoryCache import InMemoryCache, CacheEntry

app = Flask(__name__, static_folder='dist/public')

DB = DBHelper()
CORS(app)

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
    route_id = data.get('routeId')
    pokemon_data = data.get('pokemon')
    outcome = data.get('outcome')
    pokemon_id = pokemon_data.get('id')
    DB.add_encounter(route_id, pokemon_id, outcome, pokemon_data.get('metadata'))
    return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}

@app.route("/api/v1/encounters")
def api_get_encounters():
    return jsonify(DB.get_encounters())


@app.route("/pokemon/<pokemonId>")
def pokemonInfo(pokemonId):
    return jsonify(pokemon_cache.get(int(pokemonId)).asJson())

@app.route("/api/v1/route/<routeId>")
def api_route_info(routeId):
    return jsonify(DB.get_route(int(routeId)))
    # return jsonify(route_cache.get(int(routeId)).asJson())

@app.route("/api/v1/routes")
def routes():
    return jsonify(DB.get_routes())

@app.route("/pokemon", methods=['GET'])
def displayAll():
    return jsonify(pokemon_cache.statusMap())

@app.route("/encounter", methods=['POST'])
def postEncounter():
    if request.method == 'POST':
        data = request.get_json()
        pokemonIds = data['pokemonIds']
        route = data['route']
        e = Encounter(datetime.datetime.now().time(), route, pokemonIds)
        return "Logged encounter with {0} on route {1}".format(pokemonIds, route)


if __name__ == '__main__':
    app.run(use_reloader=True, port=5000, threaded=True)