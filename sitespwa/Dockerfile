ARG BUILD_FROM
FROM $BUILD_FROM

# Copy your application
WORKDIR /app
COPY . /app
RUN pip3 install --no-cache-dir -r /app/requirements.txt
RUN chmod a+x /app/run.sh

# Set the command to run your script
CMD ["/app/run.sh"]