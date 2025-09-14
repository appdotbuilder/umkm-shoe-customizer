<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Order;
use App\Models\Product;
use App\Models\Sale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the dashboard with key metrics.
     */
    public function index()
    {
        // Get current month and year
        $currentMonth = now()->month;
        $currentYear = now()->year;
        
        // Calculate key metrics
        $totalCustomers = Customer::count();
        $totalProducts = Product::active()->count();
        $totalOrders = Order::count();
        $monthlyRevenue = Sale::whereMonth('payment_date', $currentMonth)
            ->whereYear('payment_date', $currentYear)
            ->sum('amount');
        
        // Recent orders
        $recentOrders = Order::with(['customer', 'items.product'])
            ->latest()
            ->take(5)
            ->get();
        
        // Monthly sales data for chart
        $monthlySales = Sale::select(
                DB::raw("CAST(strftime('%m', payment_date) as INTEGER) as month"),
                DB::raw('SUM(amount) as total')
            )
            ->whereYear('payment_date', $currentYear)
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->pluck('total', 'month')
            ->toArray();
        
        // Fill missing months with 0
        $salesData = [];
        for ($i = 1; $i <= 12; $i++) {
            $salesData[] = $monthlySales[$i] ?? 0;
        }
        
        // Top selling products
        $topProducts = Product::select('products.*', DB::raw('SUM(order_items.quantity) as total_sold'))
            ->join('order_items', 'products.id', '=', 'order_items.product_id')
            ->groupBy('products.id')
            ->orderBy('total_sold', 'desc')
            ->take(5)
            ->get();
        
        return Inertia::render('dashboard', [
            'metrics' => [
                'totalCustomers' => $totalCustomers,
                'totalProducts' => $totalProducts,
                'totalOrders' => $totalOrders,
                'monthlyRevenue' => $monthlyRevenue,
            ],
            'recentOrders' => $recentOrders,
            'salesData' => $salesData,
            'topProducts' => $topProducts,
        ]);
    }
}