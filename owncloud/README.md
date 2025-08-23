# Home Assistant Add-on: ownCloud

![Supports aarch64 Architecture][aarch64-shield] ![Supports amd64 Architecture][amd64-shield] ![Supports armhf Architecture][armhf-shield] ![Supports armv7 Architecture][armv7-shield]

ownCloud personal cloud storage server for Home Assistant.

![ownCloud Logo](https://raw.githubusercontent.com/owncloud/core/master/core/img/logo/logo.svg)

## About

This add-on provides ownCloud, a self-hosted file sync and share server. ownCloud provides access to your data through a web interface, sync clients, or WebDAV while providing a platform to view, sync and share across devices easily.

With this add-on, you can:

- **Self-host your cloud storage** - Keep your files under your control
- **Sync across devices** - Access your files from anywhere
- **Share files securely** - Share files and folders with others
- **Integrate with Home Assistant** - Access Home Assistant's media and backup folders
- **Use external databases** - Connect to MySQL/MariaDB or PostgreSQL
- **Enable Redis caching** - Improve performance with Redis
- **Mount network drives** - Connect SMB/CIFS shares
- **SSL/TLS support** - Secure connections with Let's Encrypt

## Installation

1. Navigate in your Home Assistant frontend to **Settings** → **Add-ons** → **Add-on Store**.
2. Add this repository URL: `https://github.com/Jarmo-Jarmo/hassio-addons`
3. Find the "ownCloud" add-on and click it.
4. Click on the "INSTALL" button.

## How to use

1. Set the `admin_user` and `admin_password` in the configuration.
2. Add any trusted domains you want to access ownCloud from.
3. Configure your database settings (SQLite is used by default).
4. Start the add-on.
5. Check the logs of the add-on to see if everything went well.
6. Access ownCloud through the web interface.

**NOTE**: The add-on is configured to store data in `/config/data` which is persistent across restarts.

## Configuration

Add-on configuration:

```yaml
admin_user: admin
admin_password: "your-secure-password"
trusted_domains:
  - "homeassistant.local"
  - "192.168.1.100"
database_type: sqlite
enable_https: false
log_level: info
max_upload_size: "512M"
memory_limit: "512M"
```

### Option: `admin_user` (required)

The username for the ownCloud administrator account.

### Option: `admin_password` (required)

The password for the ownCloud administrator account. **Please use a strong password!**

### Option: `trusted_domains`

A list of domains that are allowed to access your ownCloud instance. This is important for security.

Example:
```yaml
trusted_domains:
  - "homeassistant.local"
  - "192.168.1.100:8080"
  - "your-domain.duckdns.org"
```

### Option: `database_type`

The type of database to use. Options are:
- `sqlite` (default) - Simple file-based database
- `mysql` - MySQL/MariaDB database
- `pgsql` - PostgreSQL database

### Option: `mysql_host`, `mysql_database`, `mysql_user`, `mysql_password`

MySQL/MariaDB connection settings (required when `database_type` is `mysql`).

### Option: `enable_https`

Enable HTTPS/SSL. Requires SSL certificates in the `/ssl` folder.

### Option: `certfile` and `keyfile`

SSL certificate and private key filenames (when HTTPS is enabled).

### Option: `redis_enabled`, `redis_host`, `redis_password`

Redis cache configuration for improved performance.

### Option: `log_level`

Controls the level of log output. Options: `debug`, `info`, `warning`, `error`.

### Option: `max_upload_size` and `memory_limit`

PHP configuration for file uploads and memory usage.

### Option: `localmounts` and `smbmounts`

Configure network mounts to access external storage:

```yaml
smbmounts:
  - server: "192.168.1.200"
    share: "shared-folder"
    mountpoint: "network-storage"
    username: "user"
    password: "password"
    workgroup: "WORKGROUP"
```

### Option: `custom_script`

Custom shell script to run during initialization for additional configuration.

## Network

The add-on exposes the following ports:

| Port | Description |
|------|-------------|
| `80` | HTTP web interface |
| `443` | HTTPS web interface (when SSL is enabled) |

## Support

In case you've found a bug, please [open an issue on GitHub](https://github.com/Jarmo-Jarmo/hassio-addons/issues).

## Security

- Always use strong passwords
- Enable HTTPS when possible
- Keep your trusted domains list minimal and accurate
- Regularly update the add-on
- Consider using external authentication if needed

## Backup

Your ownCloud data is stored in `/config/data` and is included in Home Assistant snapshots. The database (if using SQLite) is also backed up.

For external databases, make sure to backup your database separately.

## Performance Tips

1. **Use Redis caching** - Significantly improves performance
2. **Use external database** - Better performance than SQLite for large installations
3. **Configure PHP limits** - Adjust `memory_limit` and `max_upload_size` as needed
4. **Use SSD storage** - Faster storage improves overall performance

## Troubleshooting

### ownCloud is slow

- Enable Redis caching
- Increase PHP memory limit
- Check available storage space
- Consider using an external database

### Cannot upload large files

- Increase `max_upload_size` setting
- Check available storage space
- Verify nginx and PHP configurations

### Database connection failed

- Verify database credentials
- Ensure database server is accessible
- Check database server logs

### SSL/HTTPS issues

- Verify certificate files exist in `/ssl/` folder
- Check certificate validity
- Ensure certificate matches domain name

## Changelog & Releases

This repository keeps a change log using [GitHub's releases][releases]
functionality.

Releases are based on [Semantic Versioning][semver], and use the format
of `MAJOR.MINOR.PATCH`. In a nutshell, the version will be incremented
based on the following:

- `MAJOR`: Incompatible or major changes.
- `MINOR`: Backwards-compatible new features and enhancements.
- `PATCH`: Backwards-compatible bugfixes and package updates.

## Contributing

This is an active open-source project. We are always open to people who want to
use the code or contribute to it.

We have set up a separate document containing our
[contribution guidelines](.github/CONTRIBUTING.md).

Thank you for being involved! :heart_eyes:

## License

MIT License

Copyright (c) 2024

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

[aarch64-shield]: https://img.shields.io/badge/aarch64-yes-green.svg
[amd64-shield]: https://img.shields.io/badge/amd64-yes-green.svg
[armhf-shield]: https://img.shields.io/badge/armhf-yes-green.svg
[armv7-shield]: https://img.shields.io/badge/armv7-yes-green.svg
[releases]: https://github.com/Jarmo-Jarmo/hassio-addons/releases
[semver]: http://semver.org/spec/v2.0.0.html