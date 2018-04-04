from app.models.pokemon import Pokemon
from app.models.outcome import OutcomeType
from bson.objectid import ObjectId

class RunState:

    @staticmethod
    def from_dict(dict):
        print(dict)
        return RunState(dict.get('party'),
                        dict.get('box'),
                        dict.get('seen'),
                        dict.get('graveyard'),
                        dict.get('events'),
                        str(dict.get('_id')),
                        dict.get('userId'))


    def __init__(self, party=None, box=None, seen=None, graveyard=None, events=None, id=None, user=None):
        self.party = party or []
        self.box = box or []
        self.seen = seen or {}
        self.graveyard = graveyard or []
        self.events = events or []
        self.event_index = len(self.events)
        self._id = id
        self._user = user

    def apply_event(self, event):
        if event.apply(self):
            self.events.append((self.event_index, event))
            self.event_index += 1
            return True
        return False


    def to_dict(self):
        return {'party': [x.to_mongo() for x in self.party],
                'box': [x.to_mongo() for x in self.box],
                'seen': self.seen,
                'graveyard': [x.to_mongo() for x in self.graveyard],
                'events': [x[1].to_mongo() for x in self.events]}

    def to_mongo(self):
        dict = self.to_dict()
        dict['userId'] = self._user
        # dict['_id'] = str(self._id)
        dict['seen'] = {str(key): [str(x) for x in value] for key, value in dict['seen'].items()}
        return dict

    def party_size(self):
        return len(self.party)

    def box_size(self):
        return len(self.box)

    def seen_on_route(self, route_id):
        return self.seen.get(route_id) or []

    def add_new_pokemon(self, pokemon):
        if self.party_size() <= 5:
            self.party.append(pokemon)
        else:
            self.box.append(pokemon)

    def pokemon_death(self, pokemon_id):
        pokemon = self._remove_from_party(pokemon_id)
        if pokemon is not None:
            pokemon.alive = False
            self.graveyard.append(pokemon)
            return True

        return False

    def _remove_from_party(self, pokemon_id):
        return self._safe_remove_from_list(pokemon_id, self.party)

    def _remove_from_box(self, pokemon_id):
        return self._safe_remove_from_list(pokemon_id, self.box)

    def _safe_remove_from_list(self, obj_id, lst):
        obj = next((x for x in lst if x.uid == obj_id), None)
        if obj is not None:
            lst.remove(obj)
            return obj
        return None

    def add_encounter(self, encounter):
        if encounter.route_id not in self.seen:
            self.seen[encounter.route_id] = []

        if encounter.get_pokemon_id() not in self.seen[encounter.route_id]:
            self.seen[encounter.route_id].append(encounter.get_pokemon_id())

        if encounter.outcome == OutcomeType.CAUGHT:
            self.add_new_pokemon(Pokemon(encounter.pokemon_uid, encounter.get_pokemon_id(), encounter.nickname))

        return True
