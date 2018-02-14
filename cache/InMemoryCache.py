class InMemoryCache:

    def __init__(self, max_size, retrievalFunc, expiration_time=24):
        self.max_size = max_size
        self.retrievalFunc = retrievalFunc
        self.expiration_time = 24
        self._storage = {}
        self._hit = 0
        self._miss = 0


    def printStatus(self):
        for k, v in self._storage:
            print("Object {0}: {1} - usage count {2}".format(k, v, v.usage))

    def statusMap(self):
        # return {k: (v, v.usage) for k, v in self._storage}
        return {k: {'pokmon': v.value.asJson(), 'usage': v.usage} for k, v in self._storage.items()}

    def get(self, key):
        if key not in self._storage:
            print("key ${} not in storage".format(key))
            self._storage[key] = self.retrievalFunc(key)
            print("Created {}".format(self._storage[key]))
            self._miss += 1
        else:
            print("key ${} in storage".format(key))
            self._hit += 1
            self._storage[key].usage += 1
        return self._storage[key].value

class CacheEntry:

    def __init__(self, key, value):
        self.key = key
        self.value = value
        self.usage = 0