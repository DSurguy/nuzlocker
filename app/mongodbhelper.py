from pymongo import MongoClient
from app.runstate import RunState
from app.models.event import EventBuilder
from bson.objectid import ObjectId

class MongoDbHelper:


    def __init__(self, host, port):
        self._client = MongoClient(host, port)
        self._db = self._client['nuzlocker']
        self._pokemon = self._db['POKEMON_DATA']
        self._run_pokemon = self._db['RUN_POKEMON']
        self._run = self._db['RUN']
        self._event = self._db['EVENT']
        self._encounter = self._db['ENCOUNTER']

    def pokemon_is_valid(self, pokemon_id):
        return self._client.find_one({'dexId': pokemon_id}) is not None

    def add_encounter(self, run_id, encounter):
        print(encounter.to_dict())
        self._encounter.insert_one(encounter.to_dict())

    def get_run_state(self, run_id):
        run = self._run.find_one({'_id': ObjectId(run_id)})
        if run is not None:
            events = self.get_events(run_id)
            return RunState(run['party'], run['box'], run['seen'], run['graveyard'], events)
        else:
            print("Run was none")

    def update_run_state(self, run_id, state):
        pass

    def valid_run_id(self, user_id, run_id):
        for run in self._run.find():
            print(run)

        return self._run.find_one({'_id': ObjectId(run_id)}) is not None

    def get_all_runs(self, user_id):
        return [str(x['_id']) for x in self._run.find({'userId': user_id})]

    def new_run(self, user_id, run_config):
        runstate = RunState().to_dict()
        runstate['user'] = user_id
        run_id = self._run.insert_one(runstate).inserted_id
        if run_id is not None:
            return str(run_id)

    def delete_run(self, run_id):
        self._run.delete_one({'_id': ObjectId(run_id)})

    def delete_all_runs(self, user_id):
        self._run.delete_many({'user': user_id})

    def get_events(self, run_id):
        events = self._event.find({'runId': run_id})
        return [EventBuilder.createEvent(x['type'], run_id, x['date'], x['data']) for x in events]

    def get_state_at_index(self, run_id, index):
        pass

    def get_state(self, run_id):
        pass

    def get_encounters(self, user_id, run_id):
        pass

    def get_pokemon_base(self, pokemon_id):
        pass

    def get_user(self, user_id):
        pass

    def get_route(self, route_id):
        pass