from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

# Simple in-memory data store
items = [
    {"id": 1, "name": "Item A", "description": "This is item A"},
    {"id": 2, "name": "Item B", "description": "This is item B"}
]
next_id = 3

@app.route('/')
def home():
    return "Welcome to the Flask Backend!"

@app.route('/api/items', methods=['GET'])
def get_items():
    """Returns a list of all items."""
    return jsonify(items)

@app.route('/api/items', methods=['POST'])
def add_item():
    """Adds a new item to the list."""
    global next_id
    data = request.json # Get JSON data from the request body
    if not data or 'name' not in data:
        return jsonify({"error": "Name is required"}), 400

    new_item = {
        "id": next_id,
        "name": data['name'],
        "description": data.get('description', '') # Optional description
    }
    items.append(new_item)
    next_id += 1
    return jsonify(new_item), 201 # 201 Created status

@app.route('/api/items/<int:item_id>', methods=['GET'])
def get_item(item_id):
    """Returns a single item by its ID."""
    item = next((item for item in items if item["id"] == item_id), None)
    if item:
        return jsonify(item)
    return jsonify({"error": "Item not found"}), 404

if __name__ == '__main__':
    app.run(debug=True, port=5000) # Run on port 5000, debug=True for auto-reloading