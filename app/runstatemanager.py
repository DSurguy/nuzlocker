from MockDBHelper import MockDBHelper as DBHelper
from models.encounter import Encounter
DB = DBHelper()


class RunStateManager:

    def add_encounter(self, run_id, user_id, encounter):
        DB.add_encounter(run_id, user_id, encounter)
        if encounter.outcome == 'caught':
            print('caught pokemon, neat')
