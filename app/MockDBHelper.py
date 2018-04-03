from app.models.pokemon import Pokemon
from app.runstate import RunState
from app.api.response import SaveResponse
ENCOUNTERS = {}

MOCK_USERS = [{"email": "test@example.com",
               "salt": "8Fb23mMNHD5Zb8pr2qWA3PE9bH0=",
               "hashed": "1736f83698df3f8153c1fbd6ce2840f8aace4f200771a46672635374073cc876cf0aa6a31f780e576578f791b5555b50df46303f0c3a7f2d21f91aa1429ac22e"}]

MOCK_RUNS = {'test@example.com': [1, 2]}


ROUTES = {1: {'pokemon': [16, 19]},
          2: {'pokemon': [10, 16, 19, 29, 32]},
          3: {'pokemon': [16, 19, 21, 39, 56]}
          }

POKEMON_BASE = [{'id': 1, 'name': 'bulbasaur'},
                {'id': 2, 'name': 'ivysuar'},
                {'id': 10, 'name': 'caterpie'},
                {'id': 16, 'name': 'pidgey'},
                {'id': 19, 'name': 'rattata'},
                {'id': 21, 'name': 'spearow'},
                {'id': 27, 'name': 'sandshrew'},
                {'id': 29, 'name': 'nidoran_f'},
                {'id': 32, 'name': 'nidoran_m'},
                {'id': 39, 'name': 'jigglypuff'},
                {'id': 56, 'name': 'mankey'},
                {'id': 150, 'name': 'mewtwo'}]

# key is run id
MOCK_STATE = {1: RunState(party=[Pokemon(1, 19, 'flappy')], seen={1: [10, 16], 2: [10, 16, 29]})}


class MockDBHelper:

    def __init__(self, host, port):
        pass

    def pokemon_is_valid(self, pokemon_id):
        return self.get_pokemon_base(pokemon_id) is not None

    def add_encounter(self, run_id, encounter):
        encounter_list = ENCOUNTERS.get(run_id)
        if encounter_list is None:
            ENCOUNTERS[run_id] = []

        ENCOUNTERS[run_id].append(encounter)
        return True

    def get_run_state(self, run_id):
        ret = MOCK_STATE.get(run_id)
        return ret or RunState()

    def update_run_state(self, run_id, state):
        MOCK_STATE[run_id] = state

    def valid_run_id(self, user_id, run_id):
        print(user_id)
        allowed_runs = MOCK_RUNS.get(user_id)
        if allowed_runs is None or run_id not in allowed_runs:
            return False
        return True

    def get_events(self, run_id):
        return [x[1].to_dict() for x in MOCK_STATE[run_id].events]

    def get_state_at_index(self, run_id, index):
        events = [x[1] for x in MOCK_STATE[run_id].events if x[0] <= index]
        runstate = RunState()
        event_counter = 0
        for event in events:
            if not runstate.apply_event(event):
                # TODO examine how we want to handle errors during this process
                print("Something went wrong with event ")
                print(event_counter)
            event_counter += 1
        return runstate.to_dict()

    def get_state(self, run_id):
        return MOCK_STATE[run_id]

    def get_encounters(self, user_id, run_id):
        allowed_runs = MOCK_RUNS.get(user_id)
        if run_id not in allowed_runs:
            return []

        ret = ENCOUNTERS.get(run_id)
        if ret is None:
            return []
        else:
            return [x.to_dict() for x in ret]

    def get_pokemon_base(self, pokemon_id):
        base = [x for x in POKEMON_BASE if x['id'] == pokemon_id]
        if len(base) > 0:
            return base[0]
        else:
            return None

    def get_user(self, user_id):
        user = [x for x in MOCK_USERS if x['email'] == user_id]
        if len(user) > 0:
            return user[0]
        else:
            return None

    def get_route(self, route_id):
        route = ROUTES.get(route_id)
        if route is not None:
            return [{'id': base['id'], 'name': base['name']} for base in [self.get_pokemon_base(x) for x in route['pokemon']]]
        else:
            return {}