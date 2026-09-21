# ELIOR Natural Stones — Production Deployment & Operations Manual

> Production deployment standard, operational runbook, and verification procedures for **ELIOR Natural Stones**.

---

## 1. Production Architecture Overview

- **Backend Framework**: Laravel 13 (PHP 8.4+)
- **Frontend Stack**: React 19, Inertia.js 3, Tailwind CSS v4, GSAP 3.15
- **Database**: MySQL 8.0+ / MariaDB 10.6+
- **Media System**: Spatie Media Library v11 on local `public` disk (`storage/app/public`)
- **Asset Pipeline**: Vite 8 with Wayfinder
- **Web Server**: Nginx or Apache with HTTPS (TLS 1.3)
- **Process / Job Mode**: Synchronous execution (Zero queue workers required for core operations)

---

## 2. Server Prerequisites

Ensure the target host meets the following baseline requirements:

| Component      | Minimum Version | Notes                                                                                                                                                                      |
| -------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **PHP**        | `^8.4.0`        | Extensions: `bcmath`, `ctype`, `curl`, `dom`, `fileinfo`, `filter`, `gd` (or `imagick`), `json`, `mbstring`, `openssl`, `pcre`, `pdo_mysql`, `session`, `tokenizer`, `xml` |
| **MySQL**      | `^8.0`          | With `utf8mb4` charset and `utf8mb4_unicode_ci` collation                                                                                                                  |
| **Node.js**    | `^22.0.0`       | Required during build step (CI/CD or on-server builder)                                                                                                                    |
| **Composer**   | `^2.7.0`        | PHP dependency manager                                                                                                                                                     |
| **Web Server** | Nginx / Apache  | Configured with HTTPS and URL rewriting to `public/index.php`                                                                                                              |

---

## 3. Environment Configuration (.env)

1. Copy `.env.example` to `.env`:

    ```bash
    cp .env.example .env
    ```

2. Generate the application encryption key:

    ```bash
    php artisan key:generate --force
    ```

3. Configure mandatory production environment variables:
    ```dotenv
    APP_NAME="ELIOR Natural Stones"
    APP_ENV=production
    APP_DEBUG=false
    APP_URL=https://eliornaturalstones.com

    # Logging
    LOG_CHANNEL=stack
    LOG_LEVEL=warning

    # MySQL 8+ Database
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=elior_production
    DB_USERNAME=elior_db_user
    DB_PASSWORD=YOUR_STRONG_DB_PASSWORD

    # Secure Sessions & Cookies (HTTPS)
    SESSION_DRIVER=database
    SESSION_SECURE_COOKIE=true
    SESSION_HTTP_ONLY=true
    SESSION_SAME_SITE=lax

    # Storage & Media
    FILESYSTEM_DISK=public
    MEDIA_DISK=public

    # Sanctum & CORS
    SANCTUM_STATEFUL_DOMAINS=eliornaturalstones.com
    CORS_ALLOWED_ORIGINS="https://eliornaturalstones.com"

    # Initial Administrator Seeding (Required on first bootstrap)
    ADMIN_DEFAULT_NAME="ELIOR Administrator"
    ADMIN_DEFAULT_EMAIL=admin@eliornaturalstones.com
    ADMIN_DEFAULT_PASSWORD=YOUR_SECURE_ADMIN_PASSWORD_MIN_12_CHARS
    ```

> [!CAUTION]
> **Never set `APP_DEBUG=true` in production.** Stack traces, SQL queries, and environment paths must never be exposed to public visitors.

---

## 4. Step-by-Step Deployment Sequence

Execute the following commands during deployment (or automated via CI/CD pipeline):

```bash
# Step 1: Put application into maintenance mode
php artisan down --render="errors::500" --secret="elior-deploy-bypass-token"

# Step 2: Install PHP production dependencies
composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist

# Step 3: Install frontend dependencies and compile production assets
npm ci
npm run build

# Step 4: Run database migrations safely
php artisan migrate --force

# Step 5: Ensure storage symlink exists
php artisan storage:link

# Step 6: Cache configuration, routes, and views for peak performance
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Step 7: Restart PHP-FPM / FastCGI (to clear OPcache)
sudo systemctl reload php8.4-fpm
# (or if using Octane/Docker, restart the application container)

# Step 8: Bring application out of maintenance mode
php artisan up
```

---

## 5. Initial Database Seeding (First-Time Deployment Only)

For a freshly provisioned production database, seed the canonical reserves, authentic stone varieties, editorial pages, and site settings:

```bash
# Provide a strong admin password (minimum 12 characters)
ADMIN_DEFAULT_PASSWORD="YourStrongUniqueAdminPassword123!" php artisan db:seed --force
```

> [!IMPORTANT]
> **Seeder Safety Protections**:
>
> - `DatabaseSeeder` automatically detects `app()->isProduction()` and **bypasses `EnquirySeeder`**, guaranteeing zero mock/demo customer enquiries in production.
> - `AdminUserSeeder` will **abort immediately with a RuntimeException** if `ADMIN_DEFAULT_PASSWORD` is missing, set to `'password'`, or shorter than 12 characters.

---

## 6. Storage & Persistent File Management

The application manages assets in two distinct tiers:

1. **Static Local Imagery (`public/images/elior/`)**:
    - Tracked in version control.
    - Contains all hero plates, collection images, variety swatches, and editorial plates.
    - Deployed with the code repository.

2. **Administrator-Uploaded Media (`storage/app/public/`)**:
    - Managed dynamically by Spatie Media Library through `/admin/media`.
    - Accessible publicly via `/storage/...` (through the symlink created by `php artisan storage:link`).
    - **Must be preserved across deployments and backed up regularly.**

---

## 7. Nginx Server Configuration Example

```nginx
server {
    listen 443 ssl http2;
    server_name eliornaturalstones.com www.eliornaturalstones.com;
    root /var/www/eliornaturalstones/public;

    # TLS Certificates
    ssl_certificate /etc/letsencrypt/live/eliornaturalstones.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/eliornaturalstones.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    index index.php;
    charset utf-8;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Route rewrites to Laravel entry point
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    # Static Asset Caching (Vite hashed assets)
    location ~* \.(css|js|woff2|woff|webp|jpg|jpeg|png|svg|ico)$ {
        expires 1y;
        add_header Cache-Control "public, no-transform, immutable";
        access_log off;
    }

    # PHP-FPM Execution
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.4-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_hide_header X-Powered-By;
    }

    # Prohibit hidden files (.env, .git)
    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

---

## 8. Backup & Disaster Recovery

Prior to any major release or scheduled maintenance, ensure the following persistent artifacts are backed up:

1. **MySQL Database**:

    ```bash
    mysqldump -u elior_db_user -p elior_production | gzip > /backups/elior_db_$(date +%F_%H%M%S).sql.gz
    ```

2. **Uploaded Media Assets**:

    ```bash
    tar -czf /backups/elior_storage_$(date +%F_%H%M%S).tar.gz /var/www/eliornaturalstones/storage/app/public
    ```

3. **Environment Configuration**:
    - Securely backup `/var/www/eliornaturalstones/.env` in an encrypted secrets vault (e.g. AWS Secrets Manager, 1Password, Vault).

---

## 9. Rollback Runbook

If an issue arises immediately post-deployment:

1. Put application into maintenance mode:
    ```bash
    php artisan down
    ```
2. Revert code checkout to previous Git tag/commit:
    ```bash
    git checkout <previous-release-tag>
    ```
3. Re-build frontend or point to previous release symlink:
    ```bash
    composer install --no-dev --optimize-autoloader
    npm ci && npm run build
    ```
4. Clear and rebuild caches:
    ```bash
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
    ```
5. Bring application back up:
    ```bash
    php artisan up
    ```
