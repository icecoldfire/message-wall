#!/usr/bin/python3
# -*- coding: utf-8 -*-
from flask import Flask, render_template, request, jsonify
from flask.json import JSONEncoder

class Message:
    def __init__(self, message, number, sent_timestamp):
        self.message = message
        self.number = number
        self.sent_timestamp = sent_timestamp

    def serialize(self):  
        return {           
        'message': self.message, 
        'number': self.number,
        'sent_timestamp': self.sent_timestamp         
        }


class CustomJSONEncoder(JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Message):
            return obj.serialize()
        return super(CustomJSONEncoder, self).default(obj)
        
app = Flask(__name__)
app.json_encoder = CustomJSONEncoder
messages = [Message("Some quick example text to build on the card title and make up the bulk of the card's content.", "+32111222333", "1533926104")]
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/update', methods=['POST', 'GET'])
def update():
    all = request.values.get("all")
    if(all is None):   
        latest = int(request.values["latest"])
        return jsonify(messages[latest:])
        
    return jsonify(messages)

@app.route('/post', methods=['POST', 'GET'])
def post():
    text = request.values["message"]
    number = request.values["from"]
    sent_timestamp = request.values["sent_timestamp"]
    message = Message(text, number, sent_timestamp)
    messages.append(message)
    return ''

@app.route('/reset', methods=['POST', 'GET'])
def reset():
    messages = []
    return ''

@app.route('/delete', methods=['POST', 'GET'])
def delete():
    id = int(request.values["id"])
    del messages[id]
    return ''
    
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=80, debug=True, use_reloader=True)

