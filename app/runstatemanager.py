from app.MockDBHelper import MockDBHelper as DBHelper
from app.api.response import SaveResponse
from app.models.outcome import OutcomeType
from app.models.pokemon import Pokemon
from app.models.encounter import Encounter
from app.models.event import EventBuilder
from app.runstate import RunState
import time
DB = DBHelper()

class RunStateManager:

    def __init__(self):
        self.invalid_run_response = SaveResponse(success=False, message='run id is not valid', id=None)
        self.invalid_encounter_response = SaveResponse(success=False, message='encounter is invalid', id=None)

    def add_encounter(self, run_id, user_id, request_data):
        encounter = Encounter.from_json(request_data)
        add_new_pokemon = (encounter.outcome == OutcomeType.CAUGHT)
        nickname = None
        if not encounter.is_valid():
            return self.invalid_encounter_response

        if not DB.valid_run_id(user_id, run_id):
            return self.invalid_run_response

        if add_new_pokemon:
            nickname = request_data.get('nickname')
            if nickname is None:
                return self.invalid_encounter_response

            encounter.nickname = nickname

        event = EventBuilder.createEvent('encounter', run_id, time.time() * 1000, {'encounter': encounter})

        runstate = DB.get_run_state(run_id)
        if runstate.apply_event(event):
            DB.add_encounter(run_id, encounter)
            DB.update_run_state(run_id, runstate)
            return SaveResponse(success=True, id=encounter.id, message=None)
        else:
            return self.invalid_encounter_response

    def recreate_state(self, user_id, run_id, event_id):
        return RunState()

    def add_event(self, user_id, run_id, event):
        if not DB.valid_run_id(user_id, run_id):
            return False

        runstate = DB.get_run_state(run_id)
        if runstate.apply_event(event):
            DB.update_run_state(run_id, runstate)
            return True

        return False

    def get_run(self, user_id, run_id):
        if not DB.valid_run_id(user_id, run_id):
            return None

        return DB.get_run_state(run_id)

    def get_current_state(self, user_id, run_id):
        if not DB.valid_run_id(user_id, run_id):
            return self.invalid_run_response

        return DB.get_run_state(run_id)
