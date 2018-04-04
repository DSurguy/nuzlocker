class Validation:

    event_dict_required_keys = ['userId', 'runId', 'type', 'date', 'event']


    @staticmethod
    def event_dict_is_valid(event_dict):
        for key in Validation.event_dict_required_keys:
            if key not in event_dict:
                return False
        return True


    @staticmethod
    def _event_subtype_is_valid(event_dict):
        pass



