# Varieties Admin Module

## Overview

Build a production-grade, database-driven Varieties management module at `/admin/varieties` inside ELIOR Admin.

## Tasks

- [ ] Task 1: Create Form Requests (`StoreVarietyRequest`, `UpdateVarietyRequest`) with sandstone ban and slug validation → Verify: Form requests validate correctly
- [ ] Task 2: Create `AdminVarietyController` with index, show, store, update, updateStatus, updateOrder, destroy → Verify: API endpoints return proper envelopes
- [ ] Task 3: Register API routes in `routes/api.php` under `auth:sanctum,web` and `admin` middleware → Verify: `php artisan route:list --path=api/v1/admin/varieties`
- [ ] Task 4: Enhance `AdminController@varieties` to pass initial data, pagination metadata, and collections → Verify: `/admin/varieties` renders without loading delay
- [ ] Task 5: Implement complete Varieties management interface in `resources/js/pages/admin/Varieties.tsx` → Verify: Table, search, collection filter, status filter, pagination, modals render cleanly
- [ ] Task 6: Implement comprehensive feature test suite in `tests/Feature/AdminVarietiesTest.php` covering all 27 required assertions → Verify: `php artisan test tests/Feature/AdminVarietiesTest.php`
- [ ] Task 7: Run quality gates (`types:check`, `check:fix`, `composer lint:check`, `composer types:check`, `php artisan test`, `npm run build`) → Verify: All pass with 0 errors
- [ ] Task 8: Perform live browser audit with Chrome DevTools MCP at 1440px and 375px → Verify: Zero errors or visual defects, public detail synchronization verified

## Done When

- [ ] All 27 test assertions in `AdminVarietiesTest` pass
- [ ] Full Pest test suite passes 100%
- [ ] Public collection detail pages dynamically reflect changes made in Admin
- [ ] Browser audit confirms responsive and accessible experience
