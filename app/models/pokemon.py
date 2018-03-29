import uuid

class Pokemon:

    @staticmethod
    def new(id, nickname):
        return Pokemon(uuid.uuid4(), id, nickname)

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
