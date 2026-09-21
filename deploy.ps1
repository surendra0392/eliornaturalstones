# ==============================================================================
# ELIOR Natural Stones — Production Deployment Script (PowerShell)
# ==============================================================================
$ErrorActionPreference = "Stop"

Write-Host "🚀 [ELIOR] Starting production deployment..." -ForegroundColor Cyan

# 1. Activate maintenance mode
Write-Host "🔒 Activating maintenance mode..." -ForegroundColor Yellow
php artisan down --render="errors.500" --retry=60

try {
    # 2. Pull git repository updates
    Write-Host "📥 Pulling latest git changes..." -ForegroundColor Yellow
    git pull origin main

    # 3. Install composer dependencies (optimized, no dev)
    Write-Host "📦 Installing PHP dependencies..." -ForegroundColor Yellow
    composer install --no-dev --prefer-dist --optimize-autoloader --no-interaction

    # 4. Run database migrations safely
    Write-Host "🗄️ Running database migrations..." -ForegroundColor Yellow
    php artisan migrate --force

    # 5. Build frontend production assets
    Write-Host "🎨 Building production Vite assets..." -ForegroundColor Yellow
    npm.cmd ci --prefer-offline --no-audit
    npm.cmd run build

    # 6. Clear stale caches and optimize application
    Write-Host "⚡ Optimizing application caches (config, routes, views, events)..." -ForegroundColor Yellow
    php artisan optimize:clear
    php artisan optimize

    # 7. Restart background worker queues
    Write-Host "🔄 Restarting queue workers..." -ForegroundColor Yellow
    php artisan queue:restart
}
finally {
    # 8. Restore live traffic
    Write-Host "🔓 Disabling maintenance mode..." -ForegroundColor Green
    php artisan up
}

Write-Host "🎉 [ELIOR] Production deployment completed successfully!" -ForegroundColor Green
