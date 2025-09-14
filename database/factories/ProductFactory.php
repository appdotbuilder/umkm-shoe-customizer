<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $availableSizes = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];
        $availableColors = ['black', 'white', 'brown', 'navy', 'gray', 'red', 'blue'];
        
        return [
            'category_id' => Category::factory(),
            'name' => fake()->randomElement([
                'Classic Sneaker',
                'Sport Runner',
                'Leather Boot',
                'Canvas Casual',
                'Business Oxford',
                'Comfort Walker'
            ]) . ' ' . fake()->colorName(),
            'description' => fake()->paragraph(),
            'base_price' => fake()->randomFloat(2, 50000, 500000),
            'available_sizes' => fake()->randomElements($availableSizes, random_int(5, 8)),
            'available_colors' => fake()->randomElements($availableColors, random_int(3, 6)),
            'customization_options' => [
                'upper' => ['leather', 'canvas', 'synthetic'],
                'sole' => ['rubber', 'eva', 'leather'],
                'laces' => ['standard', 'rope', 'elastic'],
                'colors' => ['custom_color_available']
            ],
            'image_url' => fake()->imageUrl(400, 400, 'shoes'),
            'is_customizable' => fake()->boolean(70),
            'active' => fake()->boolean(90),
        ];
    }

    /**
     * Indicate that the product is customizable.
     */
    public function customizable(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_customizable' => true,
            'customization_options' => [
                'upper' => ['leather', 'canvas', 'synthetic', 'mesh'],
                'sole' => ['rubber', 'eva', 'leather', 'cork'],
                'laces' => ['standard', 'rope', 'elastic', 'no_laces'],
                'colors' => ['custom_color_available'],
                'patterns' => ['solid', 'striped', 'dotted', 'custom']
            ],
        ]);
    }

    /**
     * Indicate that the product is not customizable.
     */
    public function standard(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_customizable' => false,
            'customization_options' => null,
        ]);
    }
}