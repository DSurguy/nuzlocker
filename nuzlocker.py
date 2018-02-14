import datetime
import os

from flask import Flask, request, send_from_directory
from flask import jsonify
from models.encounter import Encounter
from models.pokemon import Pokemon
from cache.InMemoryCache import InMemoryCache, CacheEntry

app = Flask(__name__, static_folder='dist/public')

cache = InMemoryCache(20, lambda x: CacheEntry(x, Pokemon({'id': x, 'name': x})))


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
    return jsonify(cache.get(pokemonId).asJson())
    # return "Information on %s" % 'bulbasaur'

@app.route("/all", methods=['GET'])
def displayAll():
    return jsonify(cache.statusMap())

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