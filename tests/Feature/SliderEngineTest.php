<?php

use App\Models\Collection;
use App\Models\Slide;
use App\Models\SlideLayer;
use App\Models\Slider;
use App\Models\User;
use Database\Seeders\AdminUserSeeder;
use Database\Seeders\CollectionSeeder;
use Database\Seeders\SliderSeeder;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    if (User::where('email', 'admin@eliornaturalstones.com')->count() === 0) {
        $this->seed(AdminUserSeeder::class);
    }
    if (Slider::count() === 0) {
        $this->seed(SliderSeeder::class);
    }
});

test('01: homepage renders frontend/Home with heroSlider data when published slider exists', function () {
    if (Collection::count() === 0) {
        $this->seed(CollectionSeeder::class);
    }

    $response = $this->get('/');

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('frontend/Home')
            ->has('heroSlider')
            ->where('heroSlider.slug', 'homepage-hero')
            ->has('heroSlider.slides', 3)
            ->where('heroSlider.slides.0.layers.0.type', 'eyebrow')
        );
});

test('02: homepage renders gracefully when heroSlider is null or no published slides exist', function () {
    if (Collection::count() === 0) {
        $this->seed(CollectionSeeder::class);
    }

    // Unpublish all sliders
    Slider::query()->update(['status' => 'draft']);

    $response = $this->get('/');

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('frontend/Home')
            ->where('heroSlider', null)
        );

    // Restore seeder
    Slider::query()->where('slug', 'homepage-hero')->update(['status' => 'published']);
});

test('03: public API GET /api/v1/sliders/homepage-hero returns published slider with published slides and visible layers', function () {
    $response = $this->getJson('/api/v1/sliders/homepage-hero');

    $response->assertOk()
        ->assertJsonPath('data.slug', 'homepage-hero')
        ->assertJsonPath('data.status', 'published')
        ->assertJsonCount(3, 'data.slides');
});

test('04: public API GET /api/v1/sliders/{slug} returns 404 for draft slider', function () {
    $draftSlider = Slider::create([
        'name' => 'Draft Arch Slider',
        'slug' => 'draft-arch-slider',
        'status' => 'draft',
    ]);

    $response = $this->getJson('/api/v1/sliders/draft-arch-slider');
    $response->assertNotFound();
});

test('05: unauthenticated access to /admin/sliders is redirected to /admin/login', function () {
    $response = $this->get('/admin/sliders');
    $response->assertRedirect('/admin/login');
});

test('06: non-admin access to /admin/sliders is rejected with 403 Forbidden', function () {
    $regularUser = User::create([
        'name' => 'General Architect',
        'email' => 'architect@designfirm.com',
        'password' => Hash::make('password'),
        'is_admin' => false,
    ]);

    $response = $this->actingAs($regularUser)->get('/admin/sliders');
    $response->assertForbidden();
});

test('07: admin can view sliders list page at /admin/sliders', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    $response = $this->actingAs($admin)->get('/admin/sliders');

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/Sliders')
            ->has('initialSliders')
        );
});

test('08: admin can view visual slide editor studio at /admin/sliders/{slider}/editor', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();
    $slider = Slider::where('slug', 'homepage-hero')->firstOrFail();

    $response = $this->actingAs($admin)->get("/admin/sliders/{$slider->id}/editor");

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/SliderEditor')
            ->has('initialSlider')
            ->where('initialSlider.slug', 'homepage-hero')
        );
});

test('09: admin can create a new slider via API', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    $payload = [
        'name' => 'Bespoke Pavilion Showcase',
        'slug' => 'bespoke-pavilion-showcase',
        'description' => 'Architectural slider presenting bespoke stone pavilions.',
        'status' => 'published',
        'settings' => [
            'autoplay' => true,
            'autoplay_interval' => 7000,
            'default_transition' => 'cinematic',
        ],
    ];

    $response = $this->actingAs($admin)->postJson('/api/v1/admin/sliders', $payload);

    $response->assertCreated()
        ->assertJsonPath('data.slug', 'bespoke-pavilion-showcase')
        ->assertJsonPath('data.settings.default_transition', 'cinematic');

    $this->assertDatabaseHas('sliders', ['slug' => 'bespoke-pavilion-showcase']);
});

test('10: admin can update an existing slider via API', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();
    $slider = Slider::where('slug', 'homepage-hero')->firstOrFail();

    $response = $this->actingAs($admin)->patchJson("/api/v1/admin/sliders/{$slider->id}", [
        'description' => 'Updated monumental architectural statement.',
        'settings' => [
            'autoplay_interval' => 8000,
            'pause_on_hover' => true,
        ],
    ]);

    $response->assertOk()
        ->assertJsonPath('data.description', 'Updated monumental architectural statement.');

    expect($slider->fresh()->settings['autoplay_interval'])->toBe(8000);
});

test('11: admin can duplicate a slider with deep cloning of slides and layers', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();
    $slider = Slider::where('slug', 'homepage-hero')->firstOrFail();

    $response = $this->actingAs($admin)->postJson("/api/v1/admin/sliders/{$slider->id}/duplicate");

    $response->assertCreated()
        ->assertJsonPath('data.name', $slider->name.' (Copy)')
        ->assertJsonPath('data.slug', 'homepage-hero-copy');

    $newSliderId = $response->json('data.id');
    $this->assertDatabaseHas('sliders', ['id' => $newSliderId, 'slug' => 'homepage-hero-copy']);
    $this->assertDatabaseHas('slides', ['slider_id' => $newSliderId]);
});

test('12: admin can add, update, reorder, duplicate and delete a slide', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();
    $slider = Slider::where('slug', 'homepage-hero')->firstOrFail();

    // 1. Add Slide
    $addResponse = $this->actingAs($admin)->postJson("/api/v1/admin/sliders/{$slider->id}/slides", [
        'title' => 'Sculpted Monoliths',
        'status' => 'published',
        'background_type' => 'image',
        'background_image' => '/images/elior/collections/hero.webp',
        'overlay_type' => 'gradient',
        'overlay_opacity' => 50,
        'content_alignment' => 'center',
        'content_width' => 'wide',
        'vertical_position' => 'center',
    ]);

    $addResponse->assertCreated();
    $slideId = $addResponse->json('data.id');

    // 2. Update Slide
    $updateResponse = $this->actingAs($admin)->patchJson("/api/v1/admin/slides/{$slideId}", [
        'title' => 'Sculpted Monoliths (Refined)',
        'transition' => 'cinematic',
    ]);
    $updateResponse->assertOk()
        ->assertJsonPath('data.title', 'Sculpted Monoliths (Refined)')
        ->assertJsonPath('data.transition', 'cinematic');

    // 3. Duplicate Slide
    $dupResponse = $this->actingAs($admin)->postJson("/api/v1/admin/slides/{$slideId}/duplicate");
    $dupResponse->assertCreated();
    $dupSlideId = $dupResponse->json('data.id');

    // 4. Reorder Slides
    $allSlideIds = $slider->fresh()->slides()->pluck('id')->toArray();
    $reversedIds = array_reverse($allSlideIds);
    $reorderResponse = $this->actingAs($admin)->postJson("/api/v1/admin/sliders/{$slider->id}/reorder-slides", [
        'slide_ids' => $reversedIds,
    ]);
    $reorderResponse->assertOk();

    // 5. Delete Slide
    $delResponse = $this->actingAs($admin)->deleteJson("/api/v1/admin/slides/{$dupSlideId}");
    $delResponse->assertOk();
    $this->assertDatabaseMissing('slides', ['id' => $dupSlideId]);
});

test('13: admin can add, update, duplicate, and delete a slide layer', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();
    $slide = Slide::firstOrFail();

    // 1. Add Layer
    $addResponse = $this->actingAs($admin)->postJson("/api/v1/admin/slides/{$slide->id}/layers", [
        'type' => 'cta',
        'name' => 'Architect Consultation CTA',
        'content' => [
            'primary_label' => 'Schedule Consultation',
            'primary_url' => '/contact',
            'secondary_label' => 'View Catalog',
            'secondary_url' => '/collections',
        ],
        'animation' => [
            'entrance' => 'fade-up',
            'duration' => 0.8,
            'delay' => 0.5,
        ],
    ]);

    $addResponse->assertCreated()
        ->assertJsonPath('data.type', 'cta');
    $layerId = $addResponse->json('data.id');

    // 2. Update Layer
    $patchResponse = $this->actingAs($admin)->patchJson("/api/v1/admin/layers/{$layerId}", [
        'name' => 'Updated CTA Layer',
        'content' => [
            'primary_label' => 'Direct Consultation',
            'primary_url' => '/contact',
        ],
    ]);
    $patchResponse->assertOk()
        ->assertJsonPath('data.name', 'Updated CTA Layer');

    // 3. Duplicate Layer
    $dupResponse = $this->actingAs($admin)->postJson("/api/v1/admin/layers/{$layerId}/duplicate");
    $dupResponse->assertCreated();
    $dupLayerId = $dupResponse->json('data.id');

    // 4. Delete Layer
    $delResponse = $this->actingAs($admin)->deleteJson("/api/v1/admin/layers/{$dupLayerId}");
    $delResponse->assertOk();
    $this->assertDatabaseMissing('slide_layers', ['id' => $dupLayerId]);
});

test('14: security rejects malicious javascript: or data: URLs in CTA layer content', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();
    $slide = Slide::firstOrFail();

    $response = $this->actingAs($admin)->postJson("/api/v1/admin/slides/{$slide->id}/layers", [
        'type' => 'cta',
        'name' => 'Malicious CTA Layer',
        'content' => [
            'primary_label' => 'Malicious Click',
            'primary_url' => 'javascript:alert(1)',
        ],
    ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['content.primary_url']);
});

test('15: security rejects invalid layer types and transition values', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();
    $slide = Slide::firstOrFail();

    $invalidLayerResponse = $this->actingAs($admin)->postJson("/api/v1/admin/slides/{$slide->id}/layers", [
        'type' => 'unsupported_video_layer',
        'name' => 'Bad Layer',
    ]);
    $invalidLayerResponse->assertUnprocessable()
        ->assertJsonValidationErrors(['type']);

    $invalidTransitionResponse = $this->actingAs($admin)->postJson('/api/v1/admin/sliders', [
        'name' => 'Bad Transition Slider',
        'slug' => 'bad-transition-slider',
        'settings' => [
            'default_transition' => 'super_crazy_spin',
        ],
    ]);
    $invalidTransitionResponse->assertUnprocessable()
        ->assertJsonValidationErrors(['settings.default_transition']);
});

test('16: deleting a slider cascades and removes associated slides and slide layers', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    // Create disposable slider with slide and layer
    $slider = Slider::create([
        'name' => 'Disposable Slider',
        'slug' => 'disposable-slider',
        'status' => 'draft',
    ]);

    $slide = Slide::create([
        'slider_id' => $slider->id,
        'title' => 'Disposable Slide',
        'status' => 'draft',
        'background_type' => 'color',
    ]);

    $layer = SlideLayer::create([
        'slide_id' => $slide->id,
        'type' => 'heading',
        'name' => 'Disposable Heading',
        'sort_order' => 1,
        'z_index' => 10,
        'content' => ['text' => 'Heading'],
    ]);

    $response = $this->actingAs($admin)->deleteJson("/api/v1/admin/sliders/{$slider->id}");
    $response->assertOk();

    $this->assertDatabaseMissing('sliders', ['id' => $slider->id]);
    $this->assertDatabaseMissing('slides', ['id' => $slide->id]);
    $this->assertDatabaseMissing('slide_layers', ['id' => $layer->id]);
});
