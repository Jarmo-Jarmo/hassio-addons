# Declare build args for each architecture
ARG BUILD_FROM_AMD64
ARG BUILD_FROM_I386
ARG BUILD_FROM_ARM64
ARG BUILD_FROM_ARMV7
#ARG BUILD_FROM_ARMHF

# Select the correct one based on the target platform
FROM ${BUILD_FROM_AMD64} AS amd64
FROM ${BUILD_FROM_I386} AS i386
FROM ${BUILD_FROM_ARM64} AS arm64
FROM ${BUILD_FROM_ARMV7} AS armv7
#FROM ${BUILD_FROM_ARMHF} AS armhf

# Copy your application
WORKDIR /app
COPY . /app
RUN pip3 install --no-cache-dir -r /app/requirements.txt
RUN chmod a+x /app/run.sh

# Set the command to run your script
CMD ["/app/run.sh"]