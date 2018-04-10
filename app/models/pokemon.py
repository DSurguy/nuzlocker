import uuid
from collections import namedtuple

class Pokemon:

    @staticmethod
    def new(id, nickname):
        return Pokemon(str(uuid.uuid4()), id, nickname)

    @staticmethod
    def from_dict(dict):
        return Pokemon(str(dict['_id']), dict['dexId'], dict['nickname'], dict['alive'])


    def __init__(self, uid, dex_id, nickname, alive=True):
        self.uid = uid
        self.dex_id = dex_id
        self.nickname = nickname
        self.alive = alive

    def to_dict(self):
        return {'uid': self.uid,
                'dexId': self.dex_id,
                'nickname': self.nickname,
                'alive': self.alive}

    def to_mongo(self):
        return {str(key): str(value) for key, value in self.to_dict().items()}

PokemonStub = namedtuple('PokemonStub', ['dexId', 'name'])