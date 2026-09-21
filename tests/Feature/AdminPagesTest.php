<?php

use App\Models\Collection;
use App\Models\Page;
use App\Models\User;
use Database\Seeders\AdminUserSeeder;
use Database\Seeders\CollectionSeeder;
use Database\Seeders\PageSeeder;
use Database\Seeders\VarietySeeder;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    if (Collection::count() === 0) {
        $this->seed(CollectionSeeder::class);
        $this->seed(VarietySeeder::class);
    }
    if (User::where('email', 'admin@eliornaturalstones.com')->count() === 0) {
        $this->seed(AdminUserSeeder::class);
    }
    if (Page::count() === 0) {
        $this->seed(PageSeeder::class);
    }
});

test('01: Admin Pages index is accessible to authorized Admin', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    $response = $this->actingAs($admin)->get('/admin/pages');

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/Pages')
            ->has('initialPages')
            ->has('initialMeta')
        );
});

test('02: Unauthenticated access to /admin/pages is redirected to login', function () {
    $response = $this->get('/admin/pages');
    $response->assertRedirect('/admin/login');
});

test('03: Non-admin access to /admin/pages is rejected with 403 Forbidden', function () {
    $regularUser = User::create([
        'name' => 'General Visitor',
        'email' => 'visitor@architects.com',
        'password' => Hash::make('password'),
        'is_admin' => false,
    ]);

    $response = $this->actingAs($regularUser)->get('/admin/pages');
    $response->assertForbidden();
});

test('04: Pages list API endpoint /api/v1/admin/pages returns valid JSON envelope with canonical pages', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    $response = $this->actingAs($admin)->getJson('/api/v1/admin/pages');

    $response->assertOk()
        ->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'title',
                    'slug',
                    'subtitle',
                    'excerpt',
                    'content',
                    'meta_title',
                    'meta_description',
                    'is_published',
                    'is_canonical',
                    'template',
                    'section_count',
                    'live_url',
                    'created_at',
                    'updated_at',
                ],
            ],
            'meta' => [
                'current_page',
                'last_page',
                'per_page',
                'total',
                'counts' => ['total', 'published', 'draft'],
            ],
            'message',
        ]);
});

test('05: Server-side search on /api/v1/admin/pages filters by title or slug', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    $response = $this->actingAs($admin)->getJson('/api/v1/admin/pages?search=our-story');

    $response->assertOk();
    $data = $response->json('data');
    expect(count($data))->toBeGreaterThanOrEqual(1);
    expect($data[0]['slug'])->toBe('our-story');
});

test('06: Status filtering on /api/v1/admin/pages isolates published and draft pages', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    // Create a temporary draft page
    $draft = Page::create([
        'title' => 'Temporary Draft Guide',
        'slug' => 'temporary-draft-guide',
        'content' => ['template' => 'standard', 'hero' => ['title' => 'Draft Guide']],
        'is_published' => false,
    ]);

    $publishedRes = $this->actingAs($admin)->getJson('/api/v1/admin/pages?status=published');
    $publishedRes->assertOk();
    $publishedSlugs = collect($publishedRes->json('data'))->pluck('slug');
    expect($publishedSlugs)->not->toContain('temporary-draft-guide');

    $draftRes = $this->actingAs($admin)->getJson('/api/v1/admin/pages?status=draft');
    $draftRes->assertOk();
    $draftSlugs = collect($draftRes->json('data'))->pluck('slug');
    expect($draftSlugs)->toContain('temporary-draft-guide');

    $draft->delete();
});

test('07: Single page detail API /api/v1/admin/pages/{page} returns structured content', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();
    $page = Page::where('slug', 'our-story')->firstOrFail();

    $response = $this->actingAs($admin)->getJson("/api/v1/admin/pages/{$page->id}");

    $response->assertOk()
        ->assertJsonPath('data.slug', 'our-story')
        ->assertJsonPath('data.is_canonical', true)
        ->assertJsonStructure([
            'data' => [
                'id',
                'title',
                'slug',
                'content' => [
                    'template',
                    'hero',
                    'timeline',
                ],
            ],
            'message',
        ]);
});

test('08: Update page API updates title, subtitle, excerpt, and content', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();
    $page = Page::where('slug', 'our-story')->firstOrFail();
    $origSubtitle = $page->subtitle;

    $updatePayload = [
        'title' => 'Our Story — Architectural Heritage',
        'subtitle' => 'Three decades of material mastery and stone curation.',
        'content' => array_merge($page->content ?? [], [
            'hero' => array_merge($page->content['hero'] ?? [], [
                'title' => 'A Legacy in Natural Stone (Updated)',
            ]),
        ]),
    ];

    $response = $this->actingAs($admin)->patchJson("/api/v1/admin/pages/{$page->id}", $updatePayload);

    $response->assertOk()
        ->assertJsonPath('data.title', 'Our Story — Architectural Heritage')
        ->assertJsonPath('data.subtitle', 'Three decades of material mastery and stone curation.');

    $fresh = $page->fresh();
    expect($fresh->title)->toBe('Our Story — Architectural Heritage');
    expect($fresh->subtitle)->toBe('Three decades of material mastery and stone curation.');

    // Revert back
    $page->update([
        'title' => 'Our Story',
        'subtitle' => $origSubtitle,
    ]);
});

test('09: Update page API updates SEO metadata correctly', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();
    $page = Page::where('slug', 'contact')->firstOrFail();

    $response = $this->actingAs($admin)->patchJson("/api/v1/admin/pages/{$page->id}", [
        'meta_title' => 'ELIOR Natural Stones | Bespoke Studio Enquiries',
        'meta_description' => 'Connect directly with our stone advisors in Hyderabad.',
    ]);

    $response->assertOk()
        ->assertJsonPath('data.meta_title', 'ELIOR Natural Stones | Bespoke Studio Enquiries')
        ->assertJsonPath('data.meta_description', 'Connect directly with our stone advisors in Hyderabad.');

    // Revert
    $page->update([
        'meta_title' => 'ELIOR Natural Stones | Contact & Material Enquiry',
        'meta_description' => 'Get in touch with ELIOR Natural Stones for material consultation, sample requests, slab reservations, and architectural trade enquiries.',
    ]);
});

test('10: Quick publish toggle /api/v1/admin/pages/{page}/publish toggles publish state', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();
    $page = Page::where('slug', 'architect-designer-services')->firstOrFail();
    expect($page->is_published)->toBeTrue();

    // Toggle to draft
    $res1 = $this->actingAs($admin)->patchJson("/api/v1/admin/pages/{$page->id}/publish", [
        'is_published' => false,
    ]);
    $res1->assertOk()->assertJsonPath('data.is_published', false);
    expect($page->fresh()->is_published)->toBeFalse();

    // Toggle back to published
    $res2 = $this->actingAs($admin)->patchJson("/api/v1/admin/pages/{$page->id}/publish", [
        'is_published' => true,
    ]);
    $res2->assertOk()->assertJsonPath('data.is_published', true);
    expect($page->fresh()->is_published)->toBeTrue();
});

test('11: Validation rejects empty title or invalid page payload', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();
    $page = Page::where('slug', 'home')->firstOrFail();

    $response = $this->actingAs($admin)->patchJson("/api/v1/admin/pages/{$page->id}", [
        'title' => '',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['title']);
});

test('12: Canonical page CANNOT be deleted (returns 422 Unprocessable Entity)', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();
    $canonicalPage = Page::where('slug', 'our-story')->firstOrFail();

    $response = $this->actingAs($admin)->deleteJson("/api/v1/admin/pages/{$canonicalPage->id}");

    $response->assertStatus(422)
        ->assertJsonPath('message', 'Canonical architectural pages cannot be deleted.');

    expect(Page::where('slug', 'our-story')->exists())->toBeTrue();
});

test('13: Canonical page slug CANNOT be modified', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();
    $page = Page::where('slug', 'our-story')->firstOrFail();

    $response = $this->actingAs($admin)->patchJson("/api/v1/admin/pages/{$page->id}", [
        'slug' => 'our-new-story-slug',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['slug']);
});

test('14: Non-canonical custom page creation succeeds', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    $payload = [
        'title' => 'Architectural Guide 2026',
        'slug' => 'architectural-guide-2026',
        'subtitle' => 'Guidance on natural stone specifications.',
        'content' => [
            'template' => 'standard',
            'hero' => ['title' => 'Architectural Guide 2026'],
        ],
        'is_published' => true,
    ];

    $response = $this->actingAs($admin)->postJson('/api/v1/admin/pages', $payload);

    $response->assertStatus(201)
        ->assertJsonPath('data.slug', 'architectural-guide-2026')
        ->assertJsonPath('data.is_canonical', false);

    $created = Page::where('slug', 'architectural-guide-2026')->first();
    expect($created)->not->toBeNull();

    // Clean up
    $created->delete();
});

test('15: Non-canonical custom page deletion succeeds', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    $page = Page::create([
        'title' => 'Temporary Spec Note',
        'slug' => 'temp-spec-note',
        'content' => ['template' => 'standard'],
        'is_published' => true,
    ]);

    $response = $this->actingAs($admin)->deleteJson("/api/v1/admin/pages/{$page->id}");

    $response->assertOk()
        ->assertJsonPath('message', "Page 'Temporary Spec Note' deleted successfully.");

    expect(Page::find($page->id))->toBeNull();
});

test('16: Public Page API /api/v1/pages/{slug} returns published page data', function () {
    $response = $this->getJson('/api/v1/pages/our-story');

    $response->assertOk()
        ->assertJsonPath('data.slug', 'our-story')
        ->assertJsonStructure([
            'data' => [
                'id',
                'title',
                'slug',
                'content',
            ],
            'message',
        ]);
});

test('17: Public Page API /api/v1/pages/{slug} returns 404 for draft/unpublished page', function () {
    $draft = Page::create([
        'title' => 'Secret Private Strategy',
        'slug' => 'secret-private-strategy',
        'content' => ['template' => 'standard'],
        'is_published' => false,
    ]);

    $response = $this->getJson('/api/v1/pages/secret-private-strategy');
    $response->assertNotFound();

    $draft->delete();
});

test('18: Public /our-story renders published CMS content', function () {
    $response = $this->get('/our-story');

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('frontend/OurStory')
            ->has('cmsContent')
            ->where('cmsContent.slug', 'our-story')
        );
});

test('19: Public /from-source-to-space renders published CMS content', function () {
    $response = $this->get('/from-source-to-space');

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('frontend/FromSourceToSpace')
            ->has('cmsContent')
            ->where('cmsContent.slug', 'from-source-to-space')
        );
});

test('20: Public /architect-designer-services renders published CMS content', function () {
    $response = $this->get('/architect-designer-services');

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('frontend/ArchitectDesignerServices')
            ->has('cmsContent')
            ->where('cmsContent.slug', 'architect-designer-services')
        );
});

test('21: Public /contact renders published CMS content', function () {
    $response = $this->get('/contact');

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('frontend/Contact')
            ->has('cmsContent')
            ->where('cmsContent.slug', 'contact')
        );
});

test('22: Public / (Home) renders published CMS content', function () {
    $response = $this->get('/');

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('frontend/Home')
            ->has('collections')
            ->has('cmsContent')
            ->where('cmsContent.slug', 'home')
        );
});

test('23: Draft updates do not leak to public /our-story (unpublished page yields null cmsContent)', function () {
    $page = Page::where('slug', 'our-story')->firstOrFail();
    $page->update(['is_published' => false]);

    $response = $this->get('/our-story');
    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('frontend/OurStory')
            ->where('cmsContent', null)
        );

    // Restore to published
    $page->update(['is_published' => true]);
});

test('24: Reserved slugs prohibited in page slugs', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    $response = $this->actingAs($admin)->postJson('/api/v1/admin/pages', [
        'title' => 'Admin Console Guide',
        'slug' => 'admin',
        'content' => ['template' => 'standard'],
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['slug']);
});

test('25: Reserved projects slug prohibited in page slugs', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    $response = $this->actingAs($admin)->postJson('/api/v1/admin/pages', [
        'title' => 'Architectural Projects',
        'slug' => 'projects',
        'content' => ['template' => 'standard'],
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['slug']);
});

test('26: Projects ban enforced: /projects returns 404', function () {
    $response = $this->get('/projects');
    $response->assertNotFound();
});

test('27: Existing Collections Admin remains fully functional', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();
    $response = $this->actingAs($admin)->get('/admin/collections');
    $response->assertOk();
});

test('28: Existing Varieties Admin remains fully functional', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();
    $response = $this->actingAs($admin)->get('/admin/varieties');
    $response->assertOk();
});

test('29: Existing Media Library Admin remains fully functional', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();
    $response = $this->actingAs($admin)->get('/admin/media');
    $response->assertOk();
});
