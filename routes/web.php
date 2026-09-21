<?php

use App\Http\Controllers\Web\AdminAuthController;
use App\Http\Controllers\Web\AdminController;
use App\Http\Controllers\Web\PublicPageController;
use App\Http\Controllers\Web\SitemapController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| ELIOR Natural Stones — Web Routes
|--------------------------------------------------------------------------
|
| Public architectural website routes & custom React admin namespace.
| Strictly NO Projects route per brand architecture requirements.
|
*/

// Public Experience Routes
Route::get('/', [PublicPageController::class, 'home'])->name('home');
Route::get('/collections', [PublicPageController::class, 'collections'])->name('collections.index');
Route::get('/collections/{slug}', [PublicPageController::class, 'collection'])->name('collections.show');
Route::get('/our-story', [PublicPageController::class, 'ourStory'])->name('our-story');
Route::get('/from-source-to-space', [PublicPageController::class, 'fromSourceToSpace'])->name('from-source-to-space');
Route::get('/architect-designer-services', [PublicPageController::class, 'architectDesignerServices'])->name('architect-designer-services');
Route::get('/contact', [PublicPageController::class, 'contact'])->name('contact');
Route::get('/sitemap.xml', [SitemapController::class, 'index'])->name('sitemap');

// Custom React Admin Routes
Route::prefix('admin')->name('admin.')->group(function () {
    // Root Admin Navigation
    Route::get('/', function () {
        return auth()->check() && auth()->user()?->isAdmin()
            ? redirect()->route('admin.dashboard')
            : redirect()->route('admin.login');
    })->name('root');

    // Admin Authentication
    Route::get('/login', [AdminAuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AdminAuthController::class, 'login'])->name('login.submit');
    Route::post('/logout', [AdminAuthController::class, 'logout'])->name('logout');

    // Protected Admin Console
    Route::middleware(['admin'])->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
        Route::get('/collections', [AdminController::class, 'collections'])->name('collections');
        Route::get('/varieties', [AdminController::class, 'varieties'])->name('varieties');
        Route::get('/media', [AdminController::class, 'media'])->name('media');
        Route::get('/pages', [AdminController::class, 'pages'])->name('pages');
        Route::get('/sliders', [AdminController::class, 'sliders'])->name('sliders');
        Route::get('/sliders/{slider}/editor', [AdminController::class, 'sliderEditor'])->name('sliders.editor');
        Route::get('/enquiries', [AdminController::class, 'enquiries'])->name('enquiries');
        Route::get('/settings', [AdminController::class, 'settings'])->name('settings');
    });
});
