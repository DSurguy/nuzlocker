class RunState:

    def __init__(self, party=None, box=None, seen=None):
        self.party = party or []
        self.box = box or []
        self.seen = seen or {}

    def party_size(self):
        return len(self.party)

    def box_size(self):
        return len(self.box)

    def seen_on_route(self, route_id):
        return self.seen.get(route_id) or []

    def add_new_pokemon(self, pokemon):
        party_size = self.party_size()
        if party_size <= 5:
            self.party[party_size] = pokemon
        else:
            self.box.append(pokemon)