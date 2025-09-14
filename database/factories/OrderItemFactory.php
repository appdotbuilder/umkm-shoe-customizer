<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OrderItem>
 */
class OrderItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $quantity = fake()->numberBetween(1, 3);
        $unitPrice = fake()->randomFloat(2, 50000, 300000);
        $totalPrice = $quantity * $unitPrice;

        return [
            'order_id' => Order::factory(),
            'product_id' => Product::factory(),
            'quantity' => $quantity,
            'unit_price' => $unitPrice,
            'total_price' => $totalPrice,
            'size' => fake()->randomElement(['36', '37', '38', '39', '40', '41', '42', '43', '44', '45']),
            'color' => fake()->randomElement(['black', 'white', 'brown', 'navy', 'gray']),
            'customizations' => [
                'upper' => fake()->randomElement(['leather', 'canvas', 'synthetic']),
                'sole' => fake()->randomElement(['rubber', 'eva', 'leather']),
                'laces' => fake()->randomElement(['standard', 'rope', 'elastic']),
                'custom_color' => fake()->optional(0.3)->hexColor(),
            ],
            'special_notes' => fake()->optional(0.2)->sentence(),
        ];
    }

    /**
     * Indicate that the item has custom design.
     */
    public function customDesign(): static
    {
        return $this->state(fn (array $attributes) => [
            'customizations' => [
                'upper' => fake()->randomElement(['leather', 'canvas', 'synthetic']),
                'sole' => fake()->randomElement(['rubber', 'eva', 'leather']),
                'laces' => fake()->randomElement(['standard', 'rope', 'elastic']),
                'custom_color' => fake()->hexColor(),
                'pattern' => fake()->randomElement(['solid', 'striped', 'dotted']),
                'logo_text' => fake()->optional(0.5)->name(),
            ],
            'special_notes' => 'Custom design requested by customer',
        ]);
    }
}