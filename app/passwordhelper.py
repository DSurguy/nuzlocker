import hashlib
import base64
import os

class PasswordHelper:

    def get_hash(self, val):
        return hashlib.sha512(val.encode('utf-8')).hexdigest()

    def get_salt(self):
        return base64.b32encode(os.urandom(20))

    def validate_password(self, plain, salt, expected):
        print(plain)
        print(salt)
        print(expected)
        return self.get_hash(plain + salt) == expected