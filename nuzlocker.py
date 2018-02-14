import datetime
import os
import json

from flask import Flask, request, send_from_directory
from flask import jsonify
from models.encounter import Encounter
from models.pokemon import Pokemon
from models.route import Route
from cache.InMemoryCache import InMemoryCache, CacheEntry

app = Flask(__name__, static_folder='dist/public')


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

@app.route("/pokemon/<pokemonId>")
def pokemonInfo(pokemonId):
    return jsonify(pokemon_cache.get(int(pokemonId)).asJson())

@app.route("/route/<routeId>")
def route_info(routeId):
    return jsonify(route_cache.get(int(routeId)).asJson())

@app.route("/routes")
def routes():
    return jsonify(route_cache.statusMap())

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