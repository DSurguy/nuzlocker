class Pokemon:

    @staticmethod
    def from_dict(dict):
        id = dict.get('id')
        name = dict.get('name')
        metadata = dict.get('metadata')
        return Pokemon(id, name, metadata)

    def __init__(self, id, name, metadata=None):
        self.id = id
        self.name = name
        self.metadata = metadata or {}

    def to_dict(self):
        return {'id': self.id, 'name': self.name, 'metadata': self.metadata}