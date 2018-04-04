from app.api.passwordhelper import PasswordHelper

class User:

    passwordHelper = PasswordHelper()

    @staticmethod
    def new_user(username, pw):
        salt = str(User.passwordHelper.get_salt())
        print(salt)
        return {'userId': username, 'salt': salt, 'hashed': User.passwordHelper.get_hash(pw + salt)}

    def __init__(self, id):
        self.id = id

    def get_id(self):
        return self.id

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def is_authenticated(self):
        return True

