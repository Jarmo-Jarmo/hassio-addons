#!/usr/bin/with-contenv bashio

# Read the port from addon configuration
PORT=$(bashio::config 'port')

# Expose the port dynamically
bashio::net.wait_for ${PORT}

echo "Starting addon on port ${PORT}"

# Start your Python application
exec python3 api.py