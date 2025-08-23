#!/usr/bin/env bash
# Ensure the data directory exists
mkdir -p /data

# Run Flask API
python3 /app/api.py --host=0.0.0.0 --port=5000
