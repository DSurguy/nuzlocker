from models.pokemon import Pokemon
import uuid


class Encounter:

    def __init__(self, routeId, outcome, pokemon):
        self.route_id = routeId
        self.outcome = outcome
        self.pokemon = pokemon
        self.id = str(uuid.uuid4())

    @staticmethod
    def new(route_id, outcome, pokemon_id, metadata):
        pokemon = Pokemon(pokemon_id, '', metadata)
        return Encounter(route_id, outcome, pokemon)

    def to_dict(self):
        return {'routeId': self.route_id, 'outcome': self.outcome, 'pokemon': self.pokemon.to_dict()}