import json
from flask import Flask, request, jsonify, send_from_directory, render_template
import hashlib
import re
import mimetypes
mimetypes.add_type('text/css', '.css')
mimetypes.add_type('application/javascript', ".js")
from flask_cors import CORS

base_folder="./public"
#scaler, mlp_clf, merged, yvar, columns = get_artifacts_from_config()

app = Flask(__name__, static_url_path="",static_folder='server/static',
            template_folder='server/templates')

CORS(app)

@app.route('/predict', methods=['POST'])
def predict():
     
     json_ = request.json

     a = json.dumps(json_, sort_keys = True).encode("utf-8")
     seed = hashlib.md5(a).hexdigest()
     df = {}
     return jsonify({'path': seed, 'df':df})


@app.route('/media/<path:sim_id>')
def send_media(sim_id):
    sim_id = re.sub('[\W_]+', '', sim_id)
    return send_from_directory( "{}/media/{}".format(base_folder,sim_id),"media.png")


@app.route('/area/<path:sim_id>')
def send_area(sim_id):
    sim_id = re.sub('[\W_]+', '', sim_id)
    return send_from_directory( "{}/area/{}".format(base_folder,sim_id),"area.csv")

@app.route('/game/<path:sim_id>')
def send_game(sim_id):
    sim_id = re.sub('[\W_]+', '', sim_id)
    return render_template('{}/index.html'.format(sim_id))

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return 'You want path: %s' % path
     
if __name__ == '__main__':
    app.debug = True
    app.run(host="0.0.0.0", port=80)
