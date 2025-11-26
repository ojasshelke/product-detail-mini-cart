from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
import time

app = Flask(__name__)
CORS(app)  # Enable CORS for all origins

@app.route('/api/products', methods=['GET'])
def get_products():
    try:
        product_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'product.json')
        with open(product_path, 'r') as f:
            data = json.load(f)
        return jsonify(data), 200
    except Exception as e:
        print(f"Error loading product data: {e}")
        return jsonify({"error": "Failed to load product data"}), 500

@app.route('/api/analytics', methods=['POST', 'GET'])
def analytics():
    if request.method == 'POST':
        try:
            data = request.get_json()
            if not data or not all(k in data for k in ['event', 'payload']):
                return jsonify({"error": "Missing required fields: event, payload"}), 400

            # Append analytics event to log file
            log_entry = {
                "event": data["event"],
                "payload": data["payload"],
                "ts": data.get("ts", int(time.time() * 1000))
            }

            log_path = os.path.join(os.path.dirname(__file__), 'analytics.log')
            with open(log_path, 'a') as f:
                f.write(json.dumps(log_entry) + '\n')

            return jsonify({"status": "recorded"}), 200
        except Exception as e:
            print(f"Error recording analytics: {e}")
            return jsonify({"error": "Failed to record analytics"}), 500
    
    elif request.method == 'GET':
        try:
            log_path = os.path.join(os.path.dirname(__file__), 'analytics.log')
            if not os.path.exists(log_path):
                return jsonify([]), 200
            
            events = []
            with open(log_path, 'r') as f:
                for line in f:
                    line = line.strip()
                    if line:
                        try:
                            events.append(json.loads(line))
                        except:
                            continue
            return jsonify(events), 200
        except Exception as e:
            print(f"Error reading analytics: {e}")
            return jsonify([]), 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
