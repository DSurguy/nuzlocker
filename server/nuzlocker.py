import datetime

from flask import Flask, request
from encounter import *

app = Flask(__name__)

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