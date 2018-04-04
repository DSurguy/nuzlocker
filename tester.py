from pymongo import MongoClient

host = 'localhost'
port = 27017
client = MongoClient(host, port)
db = client['nuzlocker']
pokemon = db['POKEMON_DATA']
run_pokemon = db['RUN_POKEMON']
run = db['RUN']
event = db['EVENT']
encounter = db['ENCOUNTER']
user = db['USER']
route = db['ROUTE']


# drop everything
# client.drop_database('nuzlocker')

for user in user.find():
    print(user)


# run.drop()

for run in run.find():
    print(run)


# event.drop()

for event in event.find():
    print(event)
