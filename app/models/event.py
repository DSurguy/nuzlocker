from app.api.constants import POKEMON_ID_KEY

class Event(object):

    def __init__(self, run_id, date):
        self.run_id = run_id
        self.date = date
        self.type = 'GENERIC_EVENT'

    def apply(self, runstate):
        pass

    def to_dict(self):
        return {'type': self.type, 'date': self.date}


class DeathEvent(Event):

    def __init__(self, run_id, date, data):
        super().__init__(run_id, date)
        self.pokemon_id = data.get(POKEMON_ID_KEY)
        self.type = 'PokemonDeath'

    def apply(self, runstate):
        return runstate.pokemon_death(self.pokemon_id)

    def to_dict(self):
        base = super().to_dict()
        base['pokemon_Id'] = self.pokemon_id

class MilestoneEvent(Event):

    def __init__(self, run_id, date, data):
        super().__init__(run_id, date)
        self.milestone_type = data.get('milestoneType')
        self.type = 'Milestone'

    def apply(self, runstate):
        return True

    def to_dict(self):
        base = super().to_dict()
        base['milestoneType'] = self.milestone_type
        return base

class EventBuilder:

    _type_map = {'death': DeathEvent, 'milestone': MilestoneEvent}

    @staticmethod
    def createEvent(eventType, run_id, date, data):
        return EventBuilder._type_map[eventType](run_id, date, data)
