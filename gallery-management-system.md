# Architectural Gallery & Admin Management System

## Overview

Build a production-grade Architectural Gallery system featuring:
1. Automated image processing pipeline that converts 29 raw sample images from `E:\Elior Natural Stones\Categories & Images\Italian marble\new\Sample` into 5:4 ratio (1500×1200 WebP), removing all logos, stamps, barcodes, plaques, and sparkles with zero artifacts.
2. Database architecture: `gallery_items` table with Spatie Media Library collection, slug generation, categorization, space typing, and order/status controls.
3. Seeder: `GallerySeeder` registering all 29 high-end architectural gallery items with media attached.
4. Admin Gallery Module at `/admin/gallery`: Full CRUD, image upload/replacement with live preview, status toggle, reordering, filtering, and delete operations.
5. Public Architectural Gallery at `/gallery`: Responsive 5:4 aspect ratio curated masonry/grid, category filters, fullscreen interactive lightbox with stone metadata and inquiry CTA.
6. Navigation integration: "Gallery" link in public header/footer/mobile menus, and in admin sidebar.

## Tasks

- [ ] Task 1: Complete batch processing of all 29 images from `E:\Elior Natural Stones\Categories & Images\Italian marble\new\Sample` to `public/images/elior/gallery/gallery-01.webp` .. `gallery-29.webp` (1500×1200 px, 5:4 aspect ratio, 100% clean of all stamps/logos/sparkles)
- [ ] Task 2: Create `gallery_items` migration, `GalleryItem` Eloquent Model with Spatie Media Library, relationships, casts, and scopes
- [ ] Task 3: Create `GallerySeeder` to seed all 29 gallery items with images and attach them to the database
- [ ] Task 4: Create Admin Form Requests (`StoreGalleryItemRequest`, `UpdateGalleryItemRequest`) with validation
- [ ] Task 5: Create `AdminGalleryController` with full CRUD, image upload/replace, reordering, and status toggle
- [ ] Task 6: Register API routes in `routes/api.php` and web routes in `routes/web.php`
- [ ] Task 7: Build Admin Gallery management interface in `resources/js/pages/admin/Gallery.tsx` with image upload/change, status toggle, search, and category filter
- [ ] Task 8: Update Admin navigation in `AdminSidebar.tsx` and `types/navigation.ts` to include Gallery
- [ ] Task 9: Implement Public Gallery page in `resources/js/Pages/frontend/Gallery/Index.tsx` with 5:4 grid, filters, and lightbox
- [ ] Task 10: Update Public navigation in `resources/js/types/navigation.ts` to include Gallery
- [ ] Task 11: Write comprehensive automated feature tests (`tests/Feature/Admin/GalleryTest.php` and `tests/Feature/GalleryPublicTest.php`)
- [ ] Task 12: Verify full build (`npm run build`, `php artisan test`), clean up scratch files, commit and push to git

## Done When

- [ ] All 29 images are processed to 1500×1200 WebP (5:4 ratio) with no stamps, watermarks, or logos
- [ ] Database migration and seeder run cleanly
- [ ] Admin can view, create, edit, upload/change images, toggle status, and delete gallery items
- [ ] Public `/gallery` page renders responsive 5:4 gallery with category filtering and interactive lightbox
- [ ] "Gallery" link is visible in public header navigation and admin sidebar
- [ ] Tests and build pass with 0 errors
- [ ] Changes are committed and pushed to git
