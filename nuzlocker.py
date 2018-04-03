import json
import os

from flask import Flask, request, send_from_directory
from flask import jsonify
from flask_login import LoginManager, login_user, logout_user, current_user
from app.passwordhelper import PasswordHelper
from app.runstatemanager import RunStateManager
from app.models.runconfiguration import RunConfiguration
from app.models.event import EventBuilder
from app.user import User

import dbconfig as cfg
if cfg.test:
    from app.MockDBHelper import MockDBHelper as DBHelper
else:
    from app.mongodbhelper import MongoDbHelper as DBHelper



app = Flask(__name__, static_folder='dist/public')
app.secret_key = 'IniR3SCXKFhl87zICvxDWFG5BGxE9GC903V4jXkn7UzO1MwMuwh6ipwVca++yoQZTgUP/V0Nwrp4WyFwdrclGbonOeSbzBQhFEJp'
login_manager = LoginManager(app)
DB = DBHelper(cfg.mongodb['host'], cfg.mongodb['port'])
PH = PasswordHelper()
SM = RunStateManager(DB)

'''
# Forms and HTML routes
'''

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if(path == ""):
        return send_from_directory("dist/public/", "index.html")
    else:
        if(os.path.exists("dist/public/" + path)):
            return send_from_directory("dist/public", path)
        else:
            return send_from_directory("dist/public", 'index.html')

@app.route("/login", methods=['POST'])
def login():
    # email = request.form.get('email')
    # password = request.form.get('password')
    email = 'test@example.com'
    password = '123456'
    stored_user = DB.get_user(email)
    if stored_user and PH.validate_password(password, stored_user['salt'], stored_user['hashed']):
        user = User(email)
        login_user(user, remember=True)
        return "OK"
    return "FAIL"


@app.route("/logout")
def logout():
    logout_user()
    return "OK"


'''
# API Routes
'''

@app.route("/api/v1/encounter", methods=['POST'])
def api_add_encounter():
    data = request.get_json()
    result = SM.add_encounter(data.get('runId'), current_user.get_id(), data)

    if (result.success):
        return json.dumps({'id': result.id}), 200, {'ContentType': 'application/json'}
    else:
        return json.dumps({'error': result.message}), 400, {'ContentType': 'application/json'}

@app.route("/api/v1/run", methods=['POST'])
def api_new_run():
    data = request.get_json()
    run_id = SM.new_run(current_user.get_id(), RunConfiguration())

    return json.dumps({'runId': run_id})

@app.route("/api/v1/runs")
def api_get_runs():
    runs = SM.get_all_run_ids(current_user.get_id())
    return json.dumps(runs)


@app.route("/api/v1/event", methods=['POST'])
def api_new_event():
    data = request.get_json()
    run_id = data.get('runId')
    event_type = data.get('type')
    event_date = data.get('date')
    event_data = data.get('event')
    event = EventBuilder.createEvent(event_type, run_id, event_date, event_data)

    if SM.add_event(current_user.get_id(), run_id, event):
        return 'OK'
    else:
        return json.dumps({'error': 'could not save event'}), 400, {'ContentType': 'application/json'}

@app.route("/api/v1/events/<run_id>")
def api_get_events(run_id):
    if not DB.valid_run_id(current_user.get_id(), int(run_id)):
        return json.dumps({'error': 'run id is not valid'}), 400, {'ContentType': 'application/json'}

    return jsonify(DB.get_events(int(run_id)))


@app.route("/api/v1/encounters/<run_id>")
def api_get_encounters(run_id):
    if not DB.valid_run_id(current_user.get_id(), int(run_id)):
        return json.dumps({'error': 'run id is not valid'}), 400, {'ContentType': 'application/json'}

    return jsonify(DB.get_encounters(current_user.get_id(), int(run_id)))

@app.route("/api/v1/run/<run_id>/delete")
def api_delete_run(run_id):
    SM.delete_run(str(run_id))
    return "OK"


@app.route("/api/v1/state/<run_id>")
def api_get_state(run_id):

    if request.args.get('index') is not None:
        return jsonify(DB.get_state_at_index(str(run_id), int(request.args['index'])))
    else:
        return jsonify(SM.get_current_state(current_user.get_id(), str(run_id)))


@app.route("/api/v1/route/<routeId>")
def api_route_info(routeId):
    return jsonify(DB.get_route(int(routeId)))




# Required by login module
@login_manager.user_loader
def load_user(user_id):
    user_password = DB.get_user(user_id)
    if user_password:
        return User(user_id)

if __name__ == '__main__':
    app.run(use_reloader=True, port=5000, threaded=True)