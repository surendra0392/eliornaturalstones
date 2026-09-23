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
        $home = Page::where('slug', 'home')->first();
        if ($home) {
            $content = $home->content ?? [];
            if (! isset($content['philosophy'])) {
                $content['philosophy'] = [];
            }
            $content['philosophy']['headline'] = 'Formed by Nature. Defined by Architecture.';
            $content['philosophy']['supportingStatement'] = 'Every block of stone carries an unrepeatable geological story, curated to bring enduring elegance and quiet luxury to spaces.';
            $home->content = $content;
            $home->save();
        }

        $ourStory = Page::where('slug', 'our-story')->first();
        if ($ourStory) {
            $content = $ourStory->content ?? [];
            if (! isset($content['philosophy'])) {
                $content['philosophy'] = [];
            }
            $content['philosophy']['headline'] = 'Formed by Nature. Defined by Architecture.';
            $content['philosophy']['supportingStatement'] = 'Every block of stone carries an unrepeatable geological story, curated to bring enduring elegance and quiet luxury to spaces.';
            $ourStory->content = $content;
            $ourStory->save();
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $home = Page::where('slug', 'home')->first();
        if ($home) {
            $content = $home->content ?? [];
            if (isset($content['philosophy'])) {
                $content['philosophy']['headline'] = 'Material First. Text Second.';
                $content['philosophy']['supportingStatement'] = 'We believe the stone should speak before the specification does.';
                $home->content = $content;
                $home->save();
            }
        }

        $ourStory = Page::where('slug', 'our-story')->first();
        if ($ourStory) {
            $content = $ourStory->content ?? [];
            if (isset($content['philosophy'])) {
                $content['philosophy']['headline'] = 'Material First. Text Second.';
                $content['philosophy']['supportingStatement'] = 'We believe the stone should speak before the specification does.';
                $ourStory->content = $content;
                $ourStory->save();
            }
        }
    }
};
