#============================#
#  OWNCLOUD HASSIO ADDON     #
#============================#
# Dockerfile for ownCloud Home Assistant Add-on

ARG BUILD_FROM
FROM $BUILD_FROM

# Set shell
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

# Install ownCloud and required packages
# hadolint ignore=DL3008
RUN \
    # Update package list
    apk update \
    \
    # Install required packages
    && apk add --no-cache \
        nginx \
        php82 \
        php82-fpm \
        php82-cli \
        php82-ctype \
        php82-curl \
        php82-dom \
        php82-fileinfo \
        php82-ftp \
        php82-gd \
        php82-iconv \
        php82-intl \
        php82-json \
        php82-ldap \
        php82-mbstring \
        php82-opcache \
        php82-openssl \
        php82-pcntl \
        php82-pdo \
        php82-pdo_mysql \
        php82-pdo_pgsql \
        php82-pdo_sqlite \
        php82-phar \
        php82-posix \
        php82-redis \
        php82-session \
        php82-simplexml \
        php82-sqlite3 \
        php82-tokenizer \
        php82-xml \
        php82-xmlreader \
        php82-xmlwriter \
        php82-zip \
        cifs-utils \
        curl \
        ffmpeg \
        imagemagick \
        redis \
        sqlite \
        tar \
        unzip \
        wget \
    \
    # Create php symlink
    && ln -sf /usr/bin/php82 /usr/bin/php \
    \
    # Create nginx user and group
    && { addgroup -S nginx || true; }\
    && { adduser -D -S -h /var/cache/nginx -s /sbin/nologin -G nginx nginx || true; } \
    \
    # Create www-data user for ownCloud
    && { addgroup -S www-data || true; } \
    && { adduser -D -S -h /var/www -s /sbin/nologin -G www-data www-data || true; } \
    \
    # Create necessary directories
    && mkdir -p \
        /var/www/owncloud \
        /data/owncloud \
        /var/run/php \
        /var/log/nginx \
        /var/log/php82 \
    \
    # Download and install ownCloud
    && OWNCLOUD_VERSION="10.13.4" \
    && wget -O /tmp/owncloud.tar.bz2 \
        "https://download.owncloud.com/server/stable/owncloud-${OWNCLOUD_VERSION}.tar.bz2" \
    && tar -xjf /tmp/owncloud.tar.bz2 -C /var/www \
    && rm /tmp/owncloud.tar.bz2 \
    \
    # Set proper permissions
    && chown -R www-data:www-data /var/www/owncloud \
    && chmod -R 755 /var/www/owncloud \
    \
    # Clean up
    && rm -rf /var/cache/apk/* /tmp/*

# Configure PHP
RUN \
    # PHP configuration
    sed -i 's/memory_limit = .*/memory_limit = 512M/' /etc/php82/php.ini \
    && sed -i 's/upload_max_filesize = .*/upload_max_filesize = 512M/' /etc/php82/php.ini \
    && sed -i 's/post_max_size = .*/post_max_size = 512M/' /etc/php82/php.ini \
    && sed -i 's/max_execution_time = .*/max_execution_time = 3600/' /etc/php82/php.ini \
    && sed -i 's/max_input_time = .*/max_input_time = 3600/' /etc/php82/php.ini \
    && sed -i 's/;date.timezone.*/date.timezone = UTC/' /etc/php82/php.ini \
    && sed -i 's/;opcache.enable=.*/opcache.enable=1/' /etc/php82/php.ini \
    && sed -i 's/;opcache.memory_consumption=.*/opcache.memory_consumption=128/' /etc/php82/php.ini \
    && sed -i 's/;opcache.max_accelerated_files=.*/opcache.max_accelerated_files=10000/' /etc/php82/php.ini \
    && sed -i 's/;opcache.revalidate_freq=.*/opcache.revalidate_freq=1/' /etc/php82/php.ini \
    \
    # PHP-FPM configuration
    && sed -i 's/listen = .*/listen = \/var\/run\/php\/php82-fpm.sock/' /etc/php82/php-fpm.d/www.conf \
    && sed -i 's/;listen.owner = .*/listen.owner = nginx/' /etc/php82/php-fpm.d/www.conf \
    && sed -i 's/;listen.group = .*/listen.group = nginx/' /etc/php82/php-fpm.d/www.conf \
    && sed -i 's/;listen.mode = .*/listen.mode = 0660/' /etc/php82/php-fpm.d/www.conf \
    && sed -i 's/user = .*/user = www-data/' /etc/php82/php-fpm.d/www.conf \
    && sed -i 's/group = .*/group = www-data/' /etc/php82/php-fpm.d/www.conf

# Copy root filesystem
COPY rootfs /

# Set proper permissions for scripts
RUN chmod a+x /etc/s6-overlay/s6-rc.d/*/run

# Set working directory
WORKDIR /var/www/owncloud

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost/status.php || exit 1

# Labels
ARG BUILD_ARCH
ARG BUILD_DATE
ARG BUILD_DESCRIPTION
ARG BUILD_NAME
ARG BUILD_REF
ARG BUILD_REPOSITORY
ARG BUILD_VERSION

LABEL \
    io.hass.name="${BUILD_NAME}" \
    io.hass.description="${BUILD_DESCRIPTION}" \
    io.hass.arch="${BUILD_ARCH}" \
    io.hass.type="addon" \
    io.hass.version=${BUILD_VERSION} \
    maintainer="Jarmo <Jarmo-Jarmo@github.com>" \
    org.opencontainers.image.title="${BUILD_NAME}" \
    org.opencontainers.image.description="${BUILD_DESCRIPTION}" \
    org.opencontainers.image.vendor="Home Assistant Add-ons" \
    org.opencontainers.image.authors="Jarmo <Jarmo-Jarmo@github.com>" \
    org.opencontainers.image.licenses="MIT" \
    org.opencontainers.image.url="https://github.com/Jarmo-Jarmo/hassio-addons" \
    org.opencontainers.image.source="https://github.com/${BUILD_REPOSITORY}" \
    org.opencontainers.image.documentation="https://github.com/${BUILD_REPOSITORY}/blob/main/README.md" \
    org.opencontainers.image.created=${BUILD_DATE} \
    org.opencontainers.image.revision=${BUILD_REF} \
    org.opencontainers.image.version=${BUILD_VERSION}