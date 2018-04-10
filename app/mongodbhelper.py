from bson.objectid import ObjectId
from pymongo import MongoClient

from app.api.user import User
from app.models.event import EventBuilder
from app.models.pokemon import PokemonStub, Pokemon
from app.models.playerrun import PlayerRun
from app.runstate import RunState

import datetime


class MongoDbHelper:


    def __init__(self, host, port):
        self._client = MongoClient(host, port)
        self._db = self._client['nuzlocker']
        self._pokemon = self._db['POKEMON_DATA']
        self._player_pokemon = self._db['PLAYER_POKEMON']
        self._run = self._db['RUN']
        self._event = self._db['EVENT']
        self._encounter = self._db['ENCOUNTER']
        self._user = self._db['USER']
        self._route = self._db['ROUTE']

    def create_user(self, user_dict):
        return self._user.insert_one({'userId': user_dict.get('userId'),
                                      'hashed': user_dict.get('hashed'),
                                      'salt': user_dict.get('salt'),
                                     'created_date': datetime.datetime.utcnow()})

    def pokemon_is_valid(self, pokemon_id):
        return self._client.find_one({'dexId': pokemon_id}) is not None

    def add_encounter(self, encounter):
        self._encounter.insert_one(encounter.to_dict())

    def get_run_state(self, run_id):
        run = self._run.find_one({'_id': ObjectId(run_id)})
        print(run)
        if run is not None:
            events = self.get_events(run_id)
            run['events'] = events
            print("Creating run state")
            print(run)
            return RunState.from_dict(run)
        else:
            print("Run was none")

    def update_run_state(self, state):
        print("The state...")
        print(state.to_mongo())
        result = self._run.update({'_id': ObjectId(state._id)}, state.to_mongo())
        print(result)

    def valid_run_id(self, user_id, run_id):
        print([x for x in self._run.find()])
        print(user_id)
        print(run_id)
        return self._run.find_one({'_id': ObjectId(run_id), 'userId': user_id}) is not None

    def get_all_runs(self, user_id):
        return [{key: str(value) for key, value in run.items()} for run in self._run.find({'userId': user_id})]

    def new_run(self, user_id, run):
        to_insert = run.to_mongo()
        to_insert['userId'] = user_id
        run_id = self._run.insert_one(to_insert).inserted_id
        if run_id is not None:
            return str(run_id)
        else:
            print("Could not insert run")


    def delete_run(self, run_id):
        self._run.delete_one({'_id': ObjectId(run_id)})

    def delete_all_runs(self, user_id):
        self._run.delete_many({'user': user_id})

    def get_events(self, run_id, index=-1):
        if (index > 0):
            events = self._event.find({'runId': run_id, 'order': {'$lt': index}}).sort('order')
        else:
            events = self._event.find({'runId': run_id}).sort('order')

        return [EventBuilder.createEvent(x['type'], x['order'], x['userId'], x['runId'], x['date'], x['event']) for x in events]


    def get_pokemon(self, pokemon_id):
        pokemon = self._player_pokemon.find_one({'_id': ObjectId(pokemon_id)})
        if pokemon is not None:
            return Pokemon.from_dict(pokemon)
        return None


    def insert_event(self, event):
        success = self._event.insert_one(event.to_mongo())
        print(success)
        return success.inserted_id

    def get_state_at_index(self, run_id, index):
        run = RunState()
        if run is None:
            return None
        events = self.get_events(run_id, index)
        for event in events:
            run.apply_event(event)
        return run

    def get_state(self, run_id):
        pass

    def create_player_pokemon(self, run_id, dex_id, nickname):
        return self._player_pokemon.insert_one({'runId': run_id, 'dexId': dex_id, 'nickname': nickname, 'alive': True}).inserted_id

    def get_encounters(self, run_id):
        events = self._event.find({'runId': run_id, 'type': 'encounter'}).sort('order')
        return [EventBuilder.createEvent(x['type'], x['order'], run_id, x['date'], x['data']) for x in events]

    def get_pokemon_base(self, pokemon_id):
        pokemon = self._pokemon.find_one({'dexId': pokemon_id})
        if pokemon is not None:
            return PokemonStub(pokemon['dexId'], pokemon['name'])
        return None

    def get_user(self, user_id):
        return User(user_id)
        # user = self._user.find_one({'userId': ObjectId(user_id)})
        # if user is not None:
        #     TODO implement user object
            # return user

    def get_route(self, route_id):
        route = self._route.find_one({'_id': ObjectId(route_id)})
        if route is not None:
            return route

    def get_all_pokemon(self):
        pokemon = self._pokemon.find()
        print(pokemon)
        ret = [PokemonStub(x['dexId'], x['name']) for x in pokemon]
        print(ret)
        return ret

    def drop_pokemon(self):
        self._pokemon.drop()

    def insert_pokemon_stub(self, pokemon):
        self._pokemon.insert_one(pokemon)
