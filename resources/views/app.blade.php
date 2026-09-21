<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <meta name="robots" content="index, follow">
        <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
        <meta name="theme-color" content="#0F0F0F">
        <meta name="msapplication-TileColor" content="#0F0F0F">

        @if ($googleVerification = config('services.google.site_verification'))
            <meta name="google-site-verification" content="{{ $googleVerification }}">
        @endif

        @php
            $props = $page['props'] ?? [];
            $siteSettings = $props['siteSettings'] ?? [];
            $collection = $props['collection'] ?? null;
            $cmsContent = $props['cmsContent'] ?? null;
            $appUrl = rtrim((string) ($props['appUrl'] ?? config('app.url', 'https://eliornaturalstones.com')), '/');
            $currentUrl = url()->current();

            $seoTitle = $collection['meta_title']
                ?? $cmsContent['meta_title']
                ?? ($collection ? "{$collection['name']} | ELIOR Natural Stones" : null)
                ?? ($cmsContent ? "{$cmsContent['title']} | ELIOR Natural Stones" : null)
                ?? ($siteSettings['default_meta_title'] ?? 'ELIOR Natural Stones — Curated Architectural Stone');

            $seoDescription = $collection['meta_description']
                ?? $cmsContent['meta_description']
                ?? $collection['description']
                ?? $cmsContent['excerpt']
                ?? ($siteSettings['default_meta_description'] ?? 'ELIOR curates nine canonical natural stone collections for discerning architects, interior designers, and luxury private residences.');

            $seoImage = $collection['hero_image']
                ?? ($cmsContent['content']['hero']['image'] ?? null)
                ?? ($siteSettings['default_social_image_id']['url'] ?? null)
                ?? '/images/elior/homepage/homepage-hero.webp';

            if (!str_starts_with((string) $seoImage, 'http')) {
                $seoImage = $appUrl . '/' . ltrim((string) $seoImage, '/');
            }
        @endphp

        <meta name="description" content="{{ $seoDescription }}">
        <link rel="canonical" href="{{ $currentUrl }}">

        <!-- Open Graph Meta Tags -->
        <meta property="og:site_name" content="ELIOR Natural Stones">
        <meta property="og:type" content="website">
        <meta property="og:url" content="{{ $currentUrl }}">
        <meta property="og:title" content="{{ $seoTitle }}">
        <meta property="og:description" content="{{ $seoDescription }}">
        <meta property="og:image" content="{{ $seoImage }}">
        <meta property="og:image:alt" content="{{ $seoTitle }}">
        <meta property="og:locale" content="en_US">

        <!-- Twitter Meta Tags -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="{{ $seoTitle }}">
        <meta name="twitter:description" content="{{ $seoDescription }}">
        <meta name="twitter:image" content="{{ $seoImage }}">
        <meta name="twitter:image:alt" content="{{ $seoTitle }}">

        @fonts

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        <x-inertia::head>
            <title>{{ $seoTitle }}</title>
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        <script data-page="app" type="application/json">{!! json_encode($page, JSON_HEX_TAG | JSON_UNESCAPED_UNICODE) !!}</script><div id="app"></div>
    </body>
</html>
