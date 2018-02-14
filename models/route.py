class Route:

    def __init__(self, dict):
        self.id = dict['id']
        self.name = dict['name']
        self.pokemon_ids = dict['pokemon']


    def asJson(self):
        return {'id': self.id, 'name': self.name, 'pokemon': self.pokemon_ids}