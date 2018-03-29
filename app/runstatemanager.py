from MockDBHelper import MockDBHelper as DBHelper
from models.encounter import Encounter
DB = DBHelper()


class RunStateManager:

    def add_encounter(self, run_id, user_id, encounter):
        if not DB.valid_run_id(user_id, run_id):
            return {'success': 'false', 'error': 'run id is not valid'}

        runstate = DB.get_run_state(run_id)
        DB.add_encounter(run_id, encounter)
        runstate.add_encounter(encounter)
        DB.update_run_state(run_id, runstate)

        return {'success': 'true', 'id': encounter.id}




    def get_current_state(self, user_id, run_id):
        if not DB.valid_run_id(user_id, run_id):
            return {'success': 'false', 'error': 'run id is not valid'}

        ret = DB.get_run_state(run_id)
        print(ret)
        print(ret.party)
        return DB.get_run_state(run_id)
