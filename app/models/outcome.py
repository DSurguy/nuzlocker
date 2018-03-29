from enum import Enum

class OutcomeType(Enum):
    CAUGHT = 'caught'
    RUNAWAY = 'runaway'
    ESCAPED = 'escaped'
    KO = 'ko'

    # __vals = {
    #     'caught': CAUGHT,
    #     'runaway': RUNAWAY,
    #     'escaped': ESCAPED,
    #     'ko': KO
    # }

    # @classmethod
    # def from_str(val):
    #     print(val)
    #     print(OutcomeType.__vals[val])
    #     return OutcomeType.__vals.get(val)
