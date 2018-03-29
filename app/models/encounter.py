import uuid

from app.models.pokemon import Pokemon
from app.models.outcome import OutcomeType

class Encounter:

    def __init__(self, route_id, pokemon_id, outcome):
        self.route_id = route_id
        self.pokemon_id = pokemon_id
        self.outcome = outcome
        self.id = str(uuid.uuid4())

    def get_pokemon_id(self):
        return self.pokemon_id

    @staticmethod
    def from_json(data):
        route_id = data.get('routeId')
        pokemon_id = data.get('pokemonId')
        outcome = OutcomeType(data.get('outcome'))
        return Encounter(route_id, pokemon_id, outcome)

    def is_valid(self):
        if self.route_id is None or self.pokemon_id is None or self.outcome is None:
            return False
        return True

    def to_dict(self):
        return {'routeId': self.route_id, 'outcome': self.outcome.value, 'pokemonId': self.pokemon_id}