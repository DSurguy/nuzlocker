from models.pokemon import Pokemon
from app.runstate import RunState

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
MOCK_STATE = {1: RunState(party=[1, 10, 16], seen={1: [10, 16], 2: [10, 16, 29]})}


class MockDBHelper:

    def add_encounter(self, run_id, encounter):
        ret = {'success': True}

        base = self.get_pokemon_base(encounter.pokemon.id)
        # print(encounter.pokemon.id)
        if base is None:
            ret['success'] = False
            ret['message'] = 'invalid pokemon id'
            return ret

        encounter.pokemon = Pokemon(base['id'], base['name'], encounter.pokemon.metadata)
        encounter_list = ENCOUNTERS.get(run_id)
        if encounter_list is None:
            ENCOUNTERS[run_id] = []

        ENCOUNTERS[run_id].append(encounter) #{'routeId': encounter.route_id, 'outcome': encounter.outcome,
                                    #'pokemon': Pokemon(base['id'], base['name'], encounter.pokemon.metadata).to_dict()})
        return ret

    def get_run_state(self, run_id):
        ret = MOCK_STATE.get(run_id)
        return ret or RunState()

    def update_run_state(self, run_id, state):
        MOCK_STATE[run_id] = state


    def valid_run_id(self, user_id, run_id):
        print(user_id)
        print(run_id)
        allowed_runs = MOCK_RUNS.get(user_id)
        print(allowed_runs)
        if allowed_runs is None or run_id not in allowed_runs:
            return False
        return True


    def get_state(self, run_id):
        return MOCK_STATE[run_id]

    def get_encounters(self, user_id, run_id):
        allowed_runs = MOCK_RUNS.get(user_id)
        print(allowed_runs)
        if run_id not in allowed_runs:
            return []

        print(ENCOUNTERS)
        ret = ENCOUNTERS.get(run_id)
        if ret is None:
            return []
        else:
            return [x.to_dict() for x in ret]

    def get_pokemon_base(self, id):
        base = [x for x in POKEMON_BASE if x['id'] == id]
        if len(base) > 0:
            return base[0]
        else:
            return None

    def get_user(self, id):
        user = [x for x in MOCK_USERS if x['email'] == id]
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