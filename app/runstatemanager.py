from app.api.response import SaveResponse
from app.models.outcome import OutcomeType
from app.models.pokemon import Pokemon
from app.models.encounter import Encounter
from app.models.event import EventBuilder
from app.runstate import RunState
import datetime

'''
All calls to this class should be validated. validation should not happen in this class
'''
class RunStateManager:

    def __init__(self, db_helper):
        self._db = db_helper
        self.invalid_run_response = SaveResponse(success=False, message='run id is not valid', id=None)
        self.invalid_encounter_response = SaveResponse(success=False, message='encounter is invalid', id=None)

    def new_run(self, user_id, run_config):
        return self._db.new_run(user_id, run_config)

    def delete_run(self, run_id):
        self._db.delete_run(run_id)

    def add_encounter(self, run_id, user_id, request_data):
        encounter = Encounter.from_json(request_data)
        add_new_pokemon = (encounter.outcome == OutcomeType.CAUGHT)
        nickname = None
        if not encounter.is_valid():
            return self.invalid_encounter_response

        if not self._db.valid_run_id(user_id, run_id):
            print("run wasn't valid?")
            return self.invalid_run_response

        if add_new_pokemon:
            nickname = request_data.get('nickname')
            if nickname is None:
                return self.invalid_encounter_response

            encounter.nickname = nickname

        runstate = self._db.get_run_state(run_id)
        event = EventBuilder.createEvent('encounter', runstate.event_index, user_id, run_id, datetime.datetime.utcnow(), {'encounter': encounter})
        if runstate.apply_event(event):
            self._db.insert_event(event)

        return SaveResponse(success=True, id=encounter.id, message=None)
        # if (self.add_event(user_id, run_id, event, runstate)):
        # if runstate.apply_event(event):
        #     self._db.add_encounter(encounter)
            # self._db.update_run_state(runstate)
        #     print('Saved successful?')
        #     return SaveResponse(success=True, id=encounter.id, message=None)
        # else:
        #     return self.invalid_encounter_response



    def add_event(self, user_id, run_id, event, current_state=None):
        if not self._db.valid_run_id(user_id, run_id):
            return False

        runstate = current_state or self._db.get_run_state(run_id)
        if runstate.apply_event(event):
            self._db.update_run_state(run_id, runstate)
            return True

        return False

    def add_event_from_dict(self, event_dict):
        runstate = self._db.get_run_state(event_dict['runId'])
        next_event_num = len(runstate.events)
        event = EventBuilder.create_from_dict(next_event_num, event_dict)

        if runstate.apply_event(event):
            print("Event applied succesfully")
            if self._db.insert_event(event) is not None:
                print("insert successful")
        else:
            print("Event could not be applied")

    def get_all_run_ids(self, user_id):
        return self._db.get_all_runs(user_id)

    def get_run_state(self, run_id, index=-1):
        # start with an empty state
        print("Getting state")
        runstate = RunState()
        events = self._db.get_events(run_id, index)
        for event in events:
            if runstate.apply_event(event):
                print("Event applied successfully")
            else:
                print("Could not apply event %d", event.order)
                break

        return runstate