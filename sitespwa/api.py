from flask import Flask, request, jsonify, send_from_directory
import sqlite3
import os
import json

def get_addon_config():
    """Read the addon configuration from Home Assistant"""
    try:
        with open('/data/options.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        # Fallback for development/testing
        return {'port': 5000}

# Get configuration
config = get_addon_config()
port = config.get('port', 5000)

app = Flask(__name__)
DB_PATH = "/data/unlocks.db"

# Ensure db folder exists
os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)

# Initialize DB
conn = sqlite3.connect(DB_PATH)
conn.execute("""
CREATE TABLE IF NOT EXISTS sites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    url TEXT UNIQUE,
    timerHours INTEGER,
    lastVisited INTEGER,
    icon TEXT
)
""")
conn.close()

def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

@app.route("/", defaults={'path': ''})
@app.route("/<path:path>")
def serve_html(path):
    return send_from_directory("./www", "index.html" if path == "" else path)

@app.route("/sites", methods=["GET"])
def get_sites():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = dict_factory
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM sites")
    sites = cursor.fetchall()
    conn.close()
    return jsonify(sites)

@app.route("/sites", methods=["POST"])
def add_or_update_site():
    data = request.json
    lastVisited = data.get("lastVisited") or 0
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO sites (name, url, timerHours, lastVisited, icon)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(url) DO UPDATE SET
        name=excluded.name,
        timerHours=excluded.timerHours,
        lastVisited=excluded.lastVisited,
        icon=excluded.icon
    """, (data["name"], data["url"], data["timerHours"], lastVisited, data.get("icon")))
    conn.commit()
    conn.close()
    return jsonify({"status": "ok"})

@app.route("/sites/<int:id>", methods=["DELETE"])
def delete_site(id):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM sites WHERE id=?", (id,))
    conn.commit()
    conn.close()
    return jsonify({"status": "ok"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=port)
