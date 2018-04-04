import datetime


class PlayerRun:

    @staticmethod
    def from_dict(dict):
        return PlayerRun(dict['game'], dict.get('startDate') or datetime.datetime.utcnow())

    def __init__(self, game, start_date):
        self.game = game
        self.start_date = start_date


    def to_mongo(self):
        return {'game': self.game, 'startDate': self.start_date}

