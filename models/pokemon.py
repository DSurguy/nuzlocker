class Pokemon:

    def __init__(self, dict):
        self.id = dict['id']
        self.name = dict['name']
        self.route_ids = dict['routes']

    def asJson(self):
        return {'id': self.id, 'name': self.name}
