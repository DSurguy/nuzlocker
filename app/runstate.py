class RunState:

    def __init__(self, party=None, box=None, seen=None, graveyard=None, events=None):
        self.party = party or []
        self.box = box or []
        self.seen = seen or {}
        self.graveyard = graveyard or []
        self.events = events or []
        self.event_index = len(self.events)

    def apply_event(self, event):
        if event.apply(self):
            self.events.append((self.event_index, event))
            self.event_index += 1
            return True
        return False


    def to_dict(self):
        return {'party': [x.to_dict() for x in self.party],
                'box': [x.to_dict() for x in self.box],
                'seen': self.seen,
                'graveyard': [x.to_dict() for x in self.graveyard],
                'events': [x[1].to_dict() for x in self.events]}

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
