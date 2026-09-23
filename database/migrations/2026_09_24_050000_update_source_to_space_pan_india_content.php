<?php

use App\Models\Page;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $page = Page::where('slug', 'from-source-to-space')->first();
        if ($page) {
            $content = $page->content ?? [];

            // Update Stage 05 in journey stages
            if (isset($content['journey']['stages']) && is_array($content['journey']['stages'])) {
                foreach ($content['journey']['stages'] as &$stage) {
                    if (($stage['index'] ?? '') === '05' || ($stage['slug'] ?? '') === 'worldwide') {
                        $stage['title'] = 'ALL OVER INDIA';
                        $stage['description'] = 'Moving selected material to project destinations all across India.';
                        $stage['slug'] = 'all-over-india';
                    }
                }
                unset($stage);
            }

            // Update Movement section
            if (isset($content['movement'])) {
                $content['movement']['stageLabel'] = '05 — ALL OVER INDIA';
                $content['movement']['subtitle'] = 'TRANSIT ACROSS INDIA';
                $content['movement']['paragraph1'] = 'Material moves because architecture moves. The journey continues from preparation toward project sites and architectural spaces all across India.';
            }

            $page->content = $content;
            $page->save();
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $page = Page::where('slug', 'from-source-to-space')->first();
        if ($page) {
            $content = $page->content ?? [];

            if (isset($content['journey']['stages']) && is_array($content['journey']['stages'])) {
                foreach ($content['journey']['stages'] as &$stage) {
                    if (($stage['index'] ?? '') === '05' || ($stage['slug'] ?? '') === 'all-over-india') {
                        $stage['title'] = 'WORLDWIDE';
                        $stage['description'] = 'Moving selected material toward its intended destination.';
                        $stage['slug'] = 'worldwide';
                    }
                }
                unset($stage);
            }

            if (isset($content['movement'])) {
                $content['movement']['stageLabel'] = '05 — WORLDWIDE';
                $content['movement']['subtitle'] = 'TRANSIT TOWARD DESTINATION';
                $content['movement']['paragraph1'] = 'Material moves because architecture moves. The journey continues from preparation toward the place where the stone will be used.';
            }

            $page->content = $content;
            $page->save();
        }
    }
};
