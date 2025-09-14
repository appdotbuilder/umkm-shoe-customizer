<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Sale;
use App\Models\User;
use Illuminate\Database\Seeder;

class ShoeBusinessSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create categories
        $categories = [
            ['name' => 'Sneakers', 'description' => 'Casual and athletic sneakers', 'active' => true],
            ['name' => 'Formal Shoes', 'description' => 'Business and formal footwear', 'active' => true],
            ['name' => 'Boots', 'description' => 'Work and fashion boots', 'active' => true],
            ['name' => 'Sandals', 'description' => 'Summer and casual sandals', 'active' => true],
            ['name' => 'Athletic Shoes', 'description' => 'Sports and running shoes', 'active' => true],
        ];

        foreach ($categories as $categoryData) {
            Category::create($categoryData);
        }

        // Create users
        if (!User::where('email', 'admin@shoes.com')->exists()) {
            User::factory()->create([
                'name' => 'Admin User',
                'email' => 'admin@shoes.com',
            ]);
        }

        // Create additional users
        User::factory(3)->create();

        // Create customers
        Customer::factory(20)->create();

        // Create products with specific data
        $sneakersCategory = Category::where('name', 'Sneakers')->first();
        $formalCategory = Category::where('name', 'Formal Shoes')->first();
        $bootsCategory = Category::where('name', 'Boots')->first();

        $products = [
            [
                'category_id' => $sneakersCategory->id,
                'name' => 'Custom Canvas Sneakers',
                'description' => 'Comfortable canvas sneakers with full customization options',
                'base_price' => 250000,
                'available_sizes' => ['36', '37', '38', '39', '40', '41', '42', '43', '44'],
                'available_colors' => ['black', 'white', 'red', 'blue', 'navy'],
                'customization_options' => [
                    'upper' => ['canvas', 'leather', 'synthetic'],
                    'sole' => ['rubber', 'eva'],
                    'laces' => ['standard', 'rope', 'elastic'],
                    'colors' => ['custom_color_available'],
                    'patterns' => ['solid', 'striped', 'dotted', 'custom']
                ],
                'is_customizable' => true,
                'active' => true,
            ],
            [
                'category_id' => $formalCategory->id,
                'name' => 'Executive Oxford Shoes',
                'description' => 'Professional leather oxford shoes for business',
                'base_price' => 450000,
                'available_sizes' => ['38', '39', '40', '41', '42', '43', '44'],
                'available_colors' => ['black', 'brown', 'mahogany'],
                'customization_options' => [
                    'upper' => ['leather', 'patent_leather'],
                    'sole' => ['leather', 'rubber'],
                    'colors' => ['custom_color_available']
                ],
                'is_customizable' => true,
                'active' => true,
            ],
            [
                'category_id' => $bootsCategory->id,
                'name' => 'Adventure Hiking Boots',
                'description' => 'Durable hiking boots for outdoor adventures',
                'base_price' => 380000,
                'available_sizes' => ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'],
                'available_colors' => ['brown', 'black', 'tan'],
                'customization_options' => [
                    'upper' => ['leather', 'synthetic', 'nubuck'],
                    'sole' => ['rubber', 'vibram'],
                    'laces' => ['rope', 'paracord'],
                    'colors' => ['custom_color_available']
                ],
                'is_customizable' => true,
                'active' => true,
            ],
        ];

        foreach ($products as $productData) {
            Product::create($productData);
        }

        // Create more random products
        Product::factory(15)->create();

        // Create orders with items
        $users = User::all();
        $customers = Customer::take(10)->get();
        $products = Product::take(5)->get();

        foreach ($customers as $customer) {
            // Create 1-2 orders per customer
            $orderCount = random_int(1, 2);
            
            for ($i = 0; $i < $orderCount; $i++) {
                $order = Order::factory()->create([
                    'customer_id' => $customer->id,
                    'user_id' => $users->random()->id,
                ]);

                // Add 1-3 items per order
                $itemCount = random_int(1, 3);
                $orderSubtotal = 0;

                for ($j = 0; $j < $itemCount; $j++) {
                    $product = $products->random();
                    $quantity = random_int(1, 2);
                    $unitPrice = (float) $product->base_price;
                    $totalPrice = $unitPrice * $quantity;
                    $orderSubtotal += $totalPrice;

                    OrderItem::factory()->create([
                        'order_id' => $order->id,
                        'product_id' => $product->id,
                        'quantity' => $quantity,
                        'unit_price' => $unitPrice,
                        'total_price' => $totalPrice,
                        'customizations' => $product->is_customizable ? [
                            'upper' => fake()->randomElement(['leather', 'canvas', 'synthetic']),
                            'sole' => fake()->randomElement(['rubber', 'eva', 'leather']),
                            'laces' => fake()->randomElement(['standard', 'rope', 'elastic']),
                            'custom_color' => fake()->hexColor(),
                            'pattern' => fake()->randomElement(['solid', 'striped', 'dotted']),
                        ] : null,
                    ]);
                }

                // Update order totals
                $taxAmount = (float) $orderSubtotal * 0.11;
                $totalAmount = (float) $orderSubtotal + $taxAmount - (float) $order->discount_amount;

                $order->update([
                    'subtotal' => $orderSubtotal,
                    'tax_amount' => $taxAmount,
                    'total_amount' => $totalAmount,
                ]);

                // Create sale record for completed orders
                if (in_array($order->status, ['delivered', 'shipped']) && $order->payment_status === 'paid') {
                    Sale::factory()->create([
                        'order_id' => $order->id,
                        'amount' => $order->total_amount,
                        'payment_date' => fake()->dateTimeBetween($order->created_at, 'now'),
                    ]);
                }
            }
        }
    }
}