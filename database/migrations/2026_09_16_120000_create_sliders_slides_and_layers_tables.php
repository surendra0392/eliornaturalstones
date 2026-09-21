<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('sliders', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('status')->default('published')->index(); // 'published', 'draft'
            $table->json('settings')->nullable();
            $table->timestamps();
        });

        Schema::create('slides', function (Blueprint $table) {
            $table->id();
            $table->foreignId('slider_id')->constrained('sliders')->cascadeOnDelete();
            $table->string('title');
            $table->string('status')->default('published')->index(); // 'published', 'draft'
            $table->integer('sort_order')->default(0)->index();
            $table->integer('duration')->nullable(); // Duration in milliseconds; null inherits slider default
            $table->string('transition')->nullable(); // 'fade', 'slide', 'crossfade', 'cinematic', etc.
            $table->string('background_type')->default('image'); // 'image', 'color'
            $table->string('background_image')->nullable();
            $table->string('background_color')->default('#0F0F0F');
            $table->string('background_position')->default('center center');
            $table->string('background_size')->default('cover');
            $table->string('overlay_type')->default('gradient'); // 'none', 'subtle', 'medium', 'gradient', 'dark'
            $table->integer('overlay_opacity')->default(40); // 0 - 100
            $table->string('content_alignment')->default('left'); // 'left', 'center', 'right'
            $table->string('content_width')->default('standard'); // 'compact', 'standard', 'wide', 'full'
            $table->string('vertical_position')->default('center'); // 'top', 'center', 'bottom'
            $table->boolean('parallax_enabled')->default(true);
            $table->float('parallax_intensity')->default(0.15);
            $table->json('settings')->nullable();
            $table->timestamps();
        });

        Schema::create('slide_layers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('slide_id')->constrained('slides')->cascadeOnDelete();
            $table->string('type')->index(); // 'eyebrow', 'heading', 'description', 'cta', 'image', 'decorative_shape', 'spacer'
            $table->string('name');
            $table->integer('sort_order')->default(0)->index();
            $table->integer('z_index')->default(10);
            $table->boolean('is_visible')->default(true)->index();
            $table->json('content')->nullable();
            $table->json('positioning')->nullable();
            $table->json('animation')->nullable();
            $table->json('responsive')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('slide_layers');
        Schema::dropIfExists('slides');
        Schema::dropIfExists('sliders');
    }
};
