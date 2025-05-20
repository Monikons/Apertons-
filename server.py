from flask import Flask, request, jsonify
from flask_cors import CORS
import json
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

DATA_FILE = r"D:\for_work\VsCode\заказ 20.05\submissions.json"

def load_data():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return []

def save_data(data):
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

@app.route('/submit', methods=['POST'])
def submit():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    message = data.get('message')
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    submissions = load_data()
    submissions.append({
        'name': name,
        'email': email,
        'message': message,
        'timestamp': timestamp
    })
    save_data(submissions)

    return jsonify({'status': 'success'})

@app.route('/submissions', methods=['GET'])
def get_submissions():
    return jsonify(load_data())

if __name__ == '__main__':
    app.run(debug=True)