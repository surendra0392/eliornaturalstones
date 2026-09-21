# Collections Admin Module

## Overview

Build a production-grade, database-driven Collections management module at `/admin/collections` inside ELIOR Admin.

## Tasks

- [ ] Task 1: Create Form Requests (`StoreCollectionRequest`, `UpdateCollectionRequest`) with sandstone ban and slug validation → Verify: `php artisan test --filter=AdminCollectionsTest`
- [ ] Task 2: Create `AdminCollectionController` with index, show, store, update, updateStatus, updateOrder, destroy → Verify: API endpoints return proper envelopes
- [ ] Task 3: Register API routes in `routes/api.php` under `auth:sanctum` and `admin` middleware → Verify: `php artisan route:list --path=api/v1/admin/collections`
- [ ] Task 4: Enhance `AdminController@collections` to pass initial data → Verify: `/admin/collections` renders without loading delay
- [ ] Task 5: Create UI primitives (`AdminTextarea`, `AdminSelect`, `AdminModal`) → Verify: Components render cleanly with full accessibility
- [ ] Task 6: Implement complete Collections management interface in `resources/js/pages/admin/Collections.tsx` → Verify: Table, search, filter, modal, confirmation dialog render
- [ ] Task 7: Update `CollectionsGridSection.tsx` and `CollectionsSection.tsx` to sort by `sort_order` → Verify: Admin order changes reflect on `/collections`
- [ ] Task 8: Implement comprehensive feature test suite in `tests/Feature/AdminCollectionsTest.php` covering all 24 required assertions → Verify: `php artisan test tests/Feature/AdminCollectionsTest.php`
- [ ] Task 9: Run quality gates (`types:check`, `check:fix`, `composer lint:check`, `composer types:check`, `php artisan test`, `npm run build`) → Verify: All pass with 0 errors
- [ ] Task 10: Perform live browser audit with Chrome DevTools MCP at 1440px and 375px → Verify: No errors or visual defects

## Done When

- [ ] All 24 test assertions in `AdminCollectionsTest` pass
- [ ] Full Pest test suite passes 100%
- [ ] Public `/collections` dynamically reflects changes made in Admin
- [ ] Browser audit confirms responsive and accessible experience
