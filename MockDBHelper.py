from models.pokemon import Pokemon, PokemonMetadata

ENCOUNTERS = []
ROUTES = [{
  'id': 0,
  'pokemon': [16, 19],
  'name': 'Route 1'
}, {
  'id': 1,
  'pokemon': [10, 16, 19, 29, 32],
  'name': 'Route 2'
}, {
  'id': 2,
  'pokemon': [16, 19, 21, 39, 56],
  'name': 'Route 3'
}]

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


class MockDBHelper:

    def add_encounter(self, route_id, pokemon_id, outcome, metadata):
        base = self.get_pokemon_base(pokemon_id)
        if isinstance(metadata, dict):
            metadata = PokemonMetadata(metadata)
        if base is None:
            return False
        else:
            ENCOUNTERS.append({'routeId': route_id,
                               'outcome': outcome,
                               'pokemon': Pokemon(base['id'],
                                                  base['name'], metadata).to_dict()})

    def get_encounters(self):
        return ENCOUNTERS

    def get_pokemon_base(self, id):
        base = [x for x in POKEMON_BASE if x['id'] == id]
        if len(base) > 0:
            return base[0]
        else:
            return None

    def get_routes(self):
        return [{'id': route['id'], 'name': route['name']} for route in ROUTES]

    def get_route(self, route_id):
        route = [x for x in ROUTES if x['id'] == route_id]
        if len(route) > 0:
          return [{'id': base['id'], 'name': base['name']} for base in [self.get_pokemon_base(x) for x in route[0]['pokemon']]]
        else:
            return []