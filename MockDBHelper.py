from models.pokemon import Pokemon, PokemonMetadata

ENCOUNTERS = []
ROUTES = []
POKEMON_BASE = [{'id': 1, 'name': 'bulbasaur'},
                {'id': 2, 'name': 'ivysuar'},
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
        print(id)
        base = [x for x in POKEMON_BASE if x['id'] == id]
        print(base)
        if len(base) > 0:
            return base[0]
        else:
            return None
