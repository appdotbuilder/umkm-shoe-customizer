<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOrderRequest;
use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Order::query()->with(['customer', 'user', 'items.product']);
        
        // Search functionality
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                  ->orWhereHas('customer', function ($customerQuery) use ($search) {
                      $customerQuery->where('name', 'like', "%{$search}%")
                                   ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }
        
        // Status filter
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }
        
        // Payment status filter
        if ($request->has('payment_status') && $request->payment_status) {
            $query->where('payment_status', $request->payment_status);
        }
        
        $orders = $query->latest()->paginate(10);
        
        return Inertia::render('orders/index', [
            'orders' => $orders,
            'filters' => [
                'search' => $request->search,
                'status' => $request->status,
                'payment_status' => $request->payment_status,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $customers = Customer::active()->get();
        $products = Product::active()->with('category')->get();
        
        return Inertia::render('orders/create', [
            'customers' => $customers,
            'products' => $products,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOrderRequest $request)
    {
        return DB::transaction(function () use ($request) {
            // Calculate totals
            $subtotal = 0;
            $items = collect($request->items);
            
            foreach ($items as $item) {
                $product = Product::findOrFail($item['product_id']);
                $subtotal += $product->base_price * $item['quantity'];
            }
            
            $taxAmount = $subtotal * 0.11; // 11% tax
            $discountAmount = $request->discount_amount ?? 0;
            $totalAmount = $subtotal + $taxAmount - $discountAmount;
            
            // Create order
            $order = Order::create([
                'order_number' => Order::generateOrderNumber(),
                'customer_id' => $request->customer_id,
                'user_id' => auth()->id(),
                'subtotal' => $subtotal,
                'tax_amount' => $taxAmount,
                'discount_amount' => $discountAmount,
                'total_amount' => $totalAmount,
                'status' => 'pending',
                'payment_status' => 'pending',
                'notes' => $request->notes,
                'expected_delivery' => $request->expected_delivery,
            ]);
            
            // Create order items
            foreach ($items as $item) {
                $product = Product::findOrFail($item['product_id']);
                $unitPrice = $product->base_price;
                $totalPrice = $unitPrice * $item['quantity'];
                
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $unitPrice,
                    'total_price' => $totalPrice,
                    'size' => $item['size'],
                    'color' => $item['color'],
                    'customizations' => $item['customizations'] ?? null,
                    'special_notes' => $item['special_notes'] ?? null,
                ]);
            }
            
            return redirect()->route('orders.show', $order)
                ->with('success', 'Order created successfully.');
        });
    }

    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        $order->load(['customer', 'user', 'items.product.category', 'sale']);
        
        return Inertia::render('orders/show', [
            'order' => $order,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Order $order)
    {
        $order->load('items.product');
        $customers = Customer::active()->get();
        $products = Product::active()->with('category')->get();
        
        return Inertia::render('orders/edit', [
            'order' => $order,
            'customers' => $customers,
            'products' => $products,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Order $order)
    {
        $order->update($request->validate([
            'status' => 'required|in:pending,confirmed,in_production,ready,shipped,delivered,cancelled',
            'payment_status' => 'required|in:pending,partial,paid,refunded',
            'notes' => 'nullable|string',
            'expected_delivery' => 'nullable|date',
        ]));

        return redirect()->route('orders.show', $order)
            ->with('success', 'Order updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        $order->delete();

        return redirect()->route('orders.index')
            ->with('success', 'Order deleted successfully.');
    }
}