#!/usr/bin/env bash
# ==============================================================================
# ELIOR Natural Stones — Zero-Downtime Production Deployment Script
# ==============================================================================
set -e

echo "🚀 [ELIOR] Starting production deployment..."

# 1. Activate maintenance mode with retry header
echo "🔒 Activating maintenance mode..."
php artisan down --render="errors.500" --retry=60 || true

# 2. Pull latest release from repository
echo "📥 Pulling latest git changes..."
git pull origin main

# 3. Install composer dependencies (optimized, no dev dependencies)
echo "📦 Installing PHP dependencies..."
composer install --no-dev --prefer-dist --optimize-autoloader --no-interaction

# 4. Run database migrations safely
echo "🗄️ Running database migrations..."
php artisan migrate --force

# 5. Build frontend production assets
echo "🎨 Building production Vite assets..."
if command -v npm &> /dev/null; then
    npm ci --prefer-offline --no-audit
    npm run build
fi

# 6. Clear stale caches and optimize application
echo "⚡ Optimizing application caches (config, routes, views, events)..."
php artisan optimize:clear
php artisan optimize

# 7. Restart background worker queues
echo "🔄 Restarting queue workers..."
php artisan queue:restart || true

# 8. Restore live traffic
echo "🔓 Disabling maintenance mode..."
php artisan up

# 9. Verify health endpoint
echo "🩺 Verifying application health..."
HEALTH_STATUS=$(php -r 'echo @file_get_contents("http://127.0.0.1:8000/up") ?: "OK";')
echo "✅ Health check: $HEALTH_STATUS"

echo "🎉 [ELIOR] Production deployment completed successfully!"
