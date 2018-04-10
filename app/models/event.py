from app.api.constants import POKEMON_ID_KEY
from app.models.encounter import Encounter

class Event(object):

    def __init__(self, order, user_id, run_id, date):
        self.order = order
        self.run_id = run_id
        self.date = date
        self.user_id = user_id
        self.type = 'GENERIC_EVENT'

    def apply(self, runstate):
        pass

    def to_dict(self):
        return {'type': self.type, 'runId': self.run_id, 'order': self.order, 'userId': self.user_id, 'date': self.date}

    def to_mongo(self):
        return self.to_dict()


class DeathEvent(Event):

    def __init__(self, order, user_id, run_id, date, data):
        super().__init__(order, user_id, run_id, date)
        self.pokemon_id = data.get(POKEMON_ID_KEY)
        self.type = 'death :('

    def apply(self, runstate):
        return runstate.pokemon_death(self.pokemon_id)

    def to_dict(self):
        base = super().to_dict()
        base['event'] = {'pokemon_Id': self.pokemon_id}
        return base

class EncounterEvent(Event):

    def __init__(self, order, user_id, run_id, date, data):
        super().__init__(order, user_id, run_id, date)
        print("CREATING ENCOUNTER -------")
        print(data)
        encounter = data.get('encounter')
        if isinstance(encounter, dict):
            encounter = Encounter.from_json(encounter)
        self.encounter = encounter
        self.type = 'encounter'

    def apply(self, runstate):
        return runstate.add_encounter(self.encounter)

    def to_dict(self):
        base = super().to_dict()
        base['event'] = {'encounter': self.encounter.to_dict()}
        return base

    def to_mongo(self):
        base = super().to_dict()
        print(self.encounter)
        base['event'] = {'encounter': self.encounter.to_mongo()}
        return base

class MilestoneEvent(Event):

    def __init__(self, order, user_id, run_id, date, data):
        super().__init__(order, user_id, run_id, date)
        self.milestone_type = data.get('milestoneType')
        self.type = 'Milestone'

    def apply(self, runstate):
        return True

    def to_dict(self):
        base = super().to_dict()
        base['event'] = {'milestoneType': self.milestone_type}
        return base

class EventBuilder:

    _type_map = {'death': DeathEvent,
                 'milestone': MilestoneEvent,
                 'encounter': EncounterEvent}

    @staticmethod
    def createEvent(eventType, order, user_id, run_id, date, data):
        print("NEW EVENT _________")
        print(data)
        return EventBuilder._type_map[eventType.lower()](order, user_id, run_id, date, data)

    @staticmethod
    def create_from_dict(order, event_dict):
        print("FROM JSON EVENT _________")
        print(event_dict)
        return EventBuilder.createEvent(event_dict['type'], order, event_dict['userId'], event_dict['runId'], event_dict['date'], event_dict['event'])
