class RunState:

    def __init__(self, party=None, box=None, seen=None):
        self.party = party or []
        self.box = box or []
        self.seen = seen or {}


    def to_dict(self):
        return {'party': self.party, 'box': self.box, 'seen': self.seen}

    def party_size(self):
        return len(self.party)

    def box_size(self):
        return len(self.box)

    def seen_on_route(self, route_id):
        return self.seen.get(route_id) or []

    def add_new_pokemon(self, pokemon):
        if self.party_size() <= 5:
            self.party.append(pokemon.id)
        else:
            self.box.append(pokemon.id)

    def add_encounter(self, encounter):
        if encounter.route_id not in self.seen:
            self.seen[encounter.route_id] = []

        if encounter.pokemon.id not in self.seen[encounter.route_id]:
            self.seen[encounter.route_id].append(encounter.pokemon.id)

        if encounter.outcome == 'caught':
            self.add_new_pokemon(encounter.pokemon)

