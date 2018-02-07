import datetime
import os

from flask import Flask, request, send_from_directory

from models.encounter import Encounter

app = Flask(__name__, static_folder='dist/public')

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if(path == ""):
        return send_from_directory("dist/public/" + path)
    else:
        if(os.path.exists("dist/public/" + path)):
            return send_from_directory("dist/public", path)
        else:
            return send_from_directory("dist/public", 'index.html')

@app.route("/pokemon/<pokemonId>")
def pokemonInfo(pokemonId):
    return "Information on %s" % 'bulbasaur'

@app.route("/encounter", methods=['POST'])
def postEncounter():
    if request.method == 'POST':
        data = request.get_json()
        pokemonIds = data['pokemonIds']
        route = data['route']
        e = Encounter(datetime.datetime.now().time(), route, pokemonIds)
        return "Logged encounter with {0} on route {1}".format(pokemonIds, route)