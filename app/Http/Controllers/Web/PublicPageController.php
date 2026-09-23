<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreEnquiryRequest;
use App\Http\Resources\V1\SliderResource;
use App\Models\Collection;
use App\Models\Page;
use App\Models\Slider;
use Database\Seeders\PageSeeder;
use Inertia\Inertia;
use Inertia\Response;

class PublicPageController extends Controller
{
    /**
     * Get published CMS page content by slug.
     *
     * @return array<string, mixed>|null
     */
    protected function getCmsContent(string $slug): ?array
    {
        $page = Page::query()
            ->where('slug', $slug)
            ->first();

        if (! $page) {
            (new PageSeeder)->run();
            $page = Page::query()->where('slug', $slug)->first();
        }

        if (! $page || ! $page->is_published) {
            return null;
        }

        return [
            'id' => $page->id,
            'title' => $page->title,
            'slug' => $page->slug,
            'subtitle' => $page->subtitle,
            'excerpt' => $page->excerpt,
            'content' => $page->content,
            'meta_title' => $page->meta_title,
            'meta_description' => $page->meta_description,
        ];
    }

    /**
     * Public architectural landing experience (Foundation).
     */
    public function home(): Response
    {
        $collections = Collection::query()
            ->where('is_active', true)
            ->withCount('varieties')
            ->orderBy('sort_order')
            ->get();

        $slider = Slider::query()
            ->published()
            ->where('slug', 'homepage-hero')
            ->first();

        if (! $slider) {
            $slider = Slider::query()->published()->first();
        }

        $sliderData = $slider ? (new SliderResource($slider))->resolve() : null;

        return Inertia::render('frontend/Home', [
            'collections' => $collections,
            'cmsContent' => $this->getCmsContent('home'),
            'heroSlider' => $sliderData,
        ]);
    }

    /**
     * Public Collections directory.
     */
    public function collections(): Response
    {
        $collections = Collection::query()
            ->where('is_active', true)
            ->withCount('varieties')
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('frontend/Collections/Index', [
            'collections' => $collections,
            'cmsContent' => $this->getCmsContent('collections'),
        ]);
    }

    /**
     * Single Collection showcase.
     */
    public function collection(string $slug): Response
    {
        $collection = Collection::query()
            ->where(function ($q) use ($slug) {
                $q->where('slug', $slug);
                if ($slug === 'sand-stone') {
                    $q->orWhere('slug', 'sandstone');
                } elseif ($slug === 'sandstone') {
                    $q->orWhere('slug', 'sand-stone');
                }
            })
            ->where('is_active', true)
            ->with(['varieties' => fn ($q) => $q->where('is_active', true)->orderBy('sort_order')])
            ->firstOrFail();

        $relatedCollections = Collection::query()
            ->where('is_active', true)
            ->where('id', '!=', $collection->id)
            ->orderBy('sort_order')
            ->take(3)
            ->get();

        return Inertia::render('frontend/Collections/Show', [
            'collection' => $collection,
            'relatedCollections' => $relatedCollections,
        ]);
    }

    /**
     * Editorial: Our Story.
     */
    public function ourStory(): Response
    {
        return Inertia::render('frontend/OurStory', [
            'cmsContent' => $this->getCmsContent('our-story'),
        ]);
    }

    /**
     * Editorial: From Source to Space.
     */
    public function fromSourceToSpace(): Response
    {
        return Inertia::render('frontend/FromSourceToSpace', [
            'cmsContent' => $this->getCmsContent('from-source-to-space'),
        ]);
    }

    /**
     * Architectural Projects Portfolio Showcase.
     */
    public function projects(): Response
    {
        return Inertia::render('frontend/Projects', [
            'cmsContent' => $this->getCmsContent('projects'),
        ]);
    }

    /**
     * Contact & Material Enquiry.
     */
    public function contact(): Response
    {
        return Inertia::render('frontend/Contact', [
            'enquiryTypes' => StoreEnquiryRequest::ENQUIRY_TYPES,
            'canonicalCollections' => StoreEnquiryRequest::CANONICAL_COLLECTIONS,
            'cmsContent' => $this->getCmsContent('contact'),
        ]);
    }
}
