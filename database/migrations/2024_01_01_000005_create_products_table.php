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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('base_price', 10, 2);
            $table->json('available_sizes')->comment('Available shoe sizes');
            $table->json('available_colors')->comment('Available colors');
            $table->json('customization_options')->nullable()->comment('Customization parts and options');
            $table->string('image_url')->nullable();
            $table->boolean('is_customizable')->default(false);
            $table->boolean('active')->default(true);
            $table->timestamps();
            
            // Indexes for performance
            $table->index('category_id');
            $table->index('name');
            $table->index('is_customizable');
            $table->index('active');
            $table->index(['active', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};