<?php

use App\Http\Controllers\Api\V1\Admin\AdminCollectionController;
use App\Http\Controllers\Api\V1\Admin\AdminDashboardController;
use App\Http\Controllers\Api\V1\Admin\AdminEnquiryController;
use App\Http\Controllers\Api\V1\Admin\AdminMediaController;
use App\Http\Controllers\Api\V1\Admin\AdminPageController;
use App\Http\Controllers\Api\V1\Admin\AdminSettingController;
use App\Http\Controllers\Api\V1\Admin\AdminSlideController;
use App\Http\Controllers\Api\V1\Admin\AdminSlideLayerController;
use App\Http\Controllers\Api\V1\Admin\AdminSliderController;
use App\Http\Controllers\Api\V1\Admin\AdminVarietyController;
use App\Http\Controllers\Api\V1\CollectionController;
use App\Http\Controllers\Api\V1\EnquiryController;
use App\Http\Controllers\Api\V1\PageController;
use App\Http\Controllers\Api\V1\SliderController;
use App\Http\Controllers\Api\V1\VarietyController;
use App\Http\Controllers\Web\AdminAuthController;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Http\Request;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| ELIOR Natural Stones — REST API Routes
|--------------------------------------------------------------------------
|
| Versioned REST API endpoints for public and client experiences.
| Predictable JSON envelopes: { data, meta, message }
|
*/

Route::prefix('v1')->middleware(['throttle:60,1'])->group(function () {
    // Sliders
    Route::get('/sliders/{slug}', [SliderController::class, 'show'])->name('api.v1.sliders.show');

    // Collections
    Route::get('/collections', [CollectionController::class, 'index'])->name('api.v1.collections.index');
    Route::get('/collections/{slug}', [CollectionController::class, 'show'])->name('api.v1.collections.show');

    // Varieties (Stones)
    Route::get('/varieties', [VarietyController::class, 'index'])->name('api.v1.varieties.index');
    Route::get('/varieties/{slug}', [VarietyController::class, 'show'])->name('api.v1.varieties.show');

    // Editorial Pages
    Route::get('/pages/{slug}', [PageController::class, 'show'])->name('api.v1.pages.show');

    // Enquiries
    Route::post('/enquiries', [EnquiryController::class, 'store'])->name('api.v1.enquiries.store');
});

// Authenticated user endpoint
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Admin REST API Endpoints
Route::prefix('v1/admin')->middleware([
    'throttle:60,1',
    EncryptCookies::class,
    AddQueuedCookiesToResponse::class,
    StartSession::class,
])->group(function () {
    Route::post('/login', [AdminAuthController::class, 'login'])->name('api.v1.admin.login');

    Route::middleware(['auth:sanctum,web', 'admin'])->group(function () {
        Route::get('/me', function (Request $request) {
            return response()->json([
                'data' => $request->user(),
                'message' => 'Admin profile retrieved.',
            ]);
        })->name('api.v1.admin.me');

        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('api.v1.admin.dashboard');
        Route::post('/logout', [AdminAuthController::class, 'logout'])->name('api.v1.admin.logout');

        // Collections Management Module
        Route::get('/collections', [AdminCollectionController::class, 'index'])->name('api.v1.admin.collections.index');
        Route::post('/collections', [AdminCollectionController::class, 'store'])->name('api.v1.admin.collections.store');
        Route::get('/collections/{collection}', [AdminCollectionController::class, 'show'])->name('api.v1.admin.collections.show');
        Route::match(['put', 'patch'], '/collections/{collection}', [AdminCollectionController::class, 'update'])->name('api.v1.admin.collections.update');
        Route::patch('/collections/{collection}/status', [AdminCollectionController::class, 'updateStatus'])->name('api.v1.admin.collections.status');
        Route::patch('/collections/{collection}/order', [AdminCollectionController::class, 'updateOrder'])->name('api.v1.admin.collections.order');
        Route::delete('/collections/{collection}', [AdminCollectionController::class, 'destroy'])->name('api.v1.admin.collections.destroy');

        // Varieties Management Module
        Route::get('/varieties', [AdminVarietyController::class, 'index'])->name('api.v1.admin.varieties.index');
        Route::post('/varieties', [AdminVarietyController::class, 'store'])->name('api.v1.admin.varieties.store');
        Route::get('/varieties/{variety}', [AdminVarietyController::class, 'show'])->name('api.v1.admin.varieties.show');
        Route::match(['put', 'patch'], '/varieties/{variety}', [AdminVarietyController::class, 'update'])->name('api.v1.admin.varieties.update');
        Route::patch('/varieties/{variety}/status', [AdminVarietyController::class, 'updateStatus'])->name('api.v1.admin.varieties.status');
        Route::patch('/varieties/{variety}/order', [AdminVarietyController::class, 'updateOrder'])->name('api.v1.admin.varieties.order');
        Route::delete('/varieties/{variety}', [AdminVarietyController::class, 'destroy'])->name('api.v1.admin.varieties.destroy');

        // Media Library Module
        Route::get('/media', [AdminMediaController::class, 'index'])->name('api.v1.admin.media.index');
        Route::post('/media', [AdminMediaController::class, 'store'])->name('api.v1.admin.media.store');
        Route::get('/media/{media}', [AdminMediaController::class, 'show'])->name('api.v1.admin.media.show');
        Route::match(['put', 'patch'], '/media/{media}', [AdminMediaController::class, 'update'])->name('api.v1.admin.media.update');
        Route::post('/media/{media}/assign', [AdminMediaController::class, 'assign'])->name('api.v1.admin.media.assign');
        Route::delete('/media/{media}', [AdminMediaController::class, 'destroy'])->name('api.v1.admin.media.destroy');

        // Pages CMS Module
        Route::get('/pages', [AdminPageController::class, 'index'])->name('api.v1.admin.pages.index');
        Route::post('/pages', [AdminPageController::class, 'store'])->name('api.v1.admin.pages.store');
        Route::get('/pages/{page}', [AdminPageController::class, 'show'])->name('api.v1.admin.pages.show');
        Route::match(['put', 'patch'], '/pages/{page}', [AdminPageController::class, 'update'])->name('api.v1.admin.pages.update');
        Route::patch('/pages/{page}/publish', [AdminPageController::class, 'publish'])->name('api.v1.admin.pages.publish');
        Route::delete('/pages/{page}', [AdminPageController::class, 'destroy'])->name('api.v1.admin.pages.destroy');

        // Enquiries Management Module
        Route::get('/enquiries', [AdminEnquiryController::class, 'index'])->name('api.v1.admin.enquiries.index');
        Route::get('/enquiries/{enquiry}', [AdminEnquiryController::class, 'show'])->name('api.v1.admin.enquiries.show');
        Route::match(['put', 'patch'], '/enquiries/{enquiry}', [AdminEnquiryController::class, 'update'])->name('api.v1.admin.enquiries.update');
        Route::patch('/enquiries/{enquiry}/status', [AdminEnquiryController::class, 'updateStatus'])->name('api.v1.admin.enquiries.status');
        Route::delete('/enquiries/{enquiry}', [AdminEnquiryController::class, 'destroy'])->name('api.v1.admin.enquiries.destroy');

        // Settings & Site Configuration Module
        Route::get('/settings', [AdminSettingController::class, 'index'])->name('api.v1.admin.settings.index');
        Route::patch('/settings', [AdminSettingController::class, 'update'])->name('api.v1.admin.settings.update');

        // Sliders Management Module
        Route::get('/sliders', [AdminSliderController::class, 'index'])->name('api.v1.admin.sliders.index');
        Route::post('/sliders', [AdminSliderController::class, 'store'])->name('api.v1.admin.sliders.store');
        Route::get('/sliders/{slider}', [AdminSliderController::class, 'show'])->name('api.v1.admin.sliders.show');
        Route::match(['put', 'patch'], '/sliders/{slider}', [AdminSliderController::class, 'update'])->name('api.v1.admin.sliders.update');
        Route::post('/sliders/{slider}/duplicate', [AdminSliderController::class, 'duplicate'])->name('api.v1.admin.sliders.duplicate');
        Route::delete('/sliders/{slider}', [AdminSliderController::class, 'destroy'])->name('api.v1.admin.sliders.destroy');

        // Slides Management Module
        Route::post('/sliders/{slider}/slides', [AdminSlideController::class, 'store'])->name('api.v1.admin.slides.store');
        Route::get('/slides/{slide}', [AdminSlideController::class, 'show'])->name('api.v1.admin.slides.show');
        Route::match(['put', 'patch'], '/slides/{slide}', [AdminSlideController::class, 'update'])->name('api.v1.admin.slides.update');
        Route::patch('/slides/{slide}/status', [AdminSlideController::class, 'updateStatus'])->name('api.v1.admin.slides.status');
        Route::post('/slides/{slide}/duplicate', [AdminSlideController::class, 'duplicate'])->name('api.v1.admin.slides.duplicate');
        Route::post('/sliders/{slider}/reorder-slides', [AdminSlideController::class, 'reorder'])->name('api.v1.admin.slides.reorder');
        Route::delete('/slides/{slide}', [AdminSlideController::class, 'destroy'])->name('api.v1.admin.slides.destroy');

        // Slide Layers Management Module
        Route::post('/slides/{slide}/layers', [AdminSlideLayerController::class, 'store'])->name('api.v1.admin.layers.store');
        Route::match(['put', 'patch'], '/layers/{layer}', [AdminSlideLayerController::class, 'update'])->name('api.v1.admin.layers.update');
        Route::post('/layers/{layer}/duplicate', [AdminSlideLayerController::class, 'duplicate'])->name('api.v1.admin.layers.duplicate');
        Route::post('/slides/{slide}/reorder-layers', [AdminSlideLayerController::class, 'reorder'])->name('api.v1.admin.layers.reorder');
        Route::delete('/layers/{layer}', [AdminSlideLayerController::class, 'destroy'])->name('api.v1.admin.layers.destroy');
    });
});
