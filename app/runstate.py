class RunState:

    def __init__(self, party=None, box=None, seen=None):
        self.party = party or []
        self.box = box or []
        self.seen = seen or {}


    def to_dict(self):
        return {'party': [x.to_dict() for x in self.party], 'box': [x.to_dict() for x in self.box], 'seen': self.seen}

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

    def add_encounter(self, encounter):
        if encounter.route_id not in self.seen:
            self.seen[encounter.route_id] = []

        if encounter.get_pokemon_id() not in self.seen[encounter.route_id]:
            self.seen[encounter.route_id].append(encounter.get_pokemon_id())
