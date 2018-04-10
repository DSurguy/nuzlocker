import uuid

from app.models.pokemon import Pokemon
from app.models.outcome import OutcomeType

class Encounter:

    def __init__(self, route_id, pokemon_id, outcome, caught_pokemon_id=None):
        self.route_id = route_id
        self.encountered_pokemon_id = pokemon_id
        self.outcome = outcome
        self.caught_pokemon_id = caught_pokemon_id



    def get_pokemon_id(self):
        return self.encountered_pokemon_id

    @staticmethod
    def from_json(data):
        print(data)
        route_id = data.get('routeId')
        pokemon_id = data.get('pokemonId')
        outcome = OutcomeType(data.get('outcome'))
        caught_pokemon_id = data.get('caughtPokemon')
        return Encounter(route_id, pokemon_id, outcome, caught_pokemon_id)

    def is_valid(self):
        return True
        # if self.route_id is None or self.pokemon_id is None or self.outcome is None:
        #     return False
        # return True

    def to_dict(self):
        base = {'routeId': self.route_id, 'outcome': self.outcome.value, 'encounteredPokemonId': self.encountered_pokemon_id}
        if self.caught_pokemon_id is not None:
            base['caughtPokemon'] = self.caught_pokemon_id
        return base

    def to_mongo(self):
        base = self.to_dict()
        print(base)
        return {key: str(value) for key, value in self.to_dict().items()}