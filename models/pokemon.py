class Pokemon:

    @staticmethod
    def from_dict(dict):
        id = dict.get('id')
        name = dict.get('name')
        metadata = PokemonMetadata(dict.get('metadata'))
        return Pokemon(id, name, metadata)

    def __init__(self, id, name, metadata):
        self.id = id
        self.name = name
        if metadata is None:
            metadata = PokemonMetadata({})
        self.metadata = metadata

    def to_dict(self):
        ret = {'id': self.id, 'name': self.name}
        if self.metadata is not None:
            ret['metadata'] = self.metadata.to_dict()
        return ret

class PokemonMetadata:

    def __init__(self, dict):
        self.vals = dict

    def to_dict(self):
        return self.vals