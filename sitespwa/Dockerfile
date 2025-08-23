# Use official Python slim image
FROM python:3.12-slim

# Set workdir
WORKDIR /app

# Copy addon files
COPY run.sh api.py requirements.txt /app/

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Make run.sh executable
RUN chmod +x /app/run.sh

# Expose port
EXPOSE 5000

# Command to run
CMD ["/app/run.sh"]
