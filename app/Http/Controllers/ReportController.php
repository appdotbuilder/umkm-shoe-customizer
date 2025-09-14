<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Sale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportController extends Controller
{
    /**
     * Display financial reports.
     */
    public function index(Request $request)
    {
        // Get date range (default to current month)
        $startDate = $request->start_date ?? now()->startOfMonth()->format('Y-m-d');
        $endDate = $request->end_date ?? now()->endOfMonth()->format('Y-m-d');
        
        // Sales summary
        $salesSummary = Sale::whereBetween('payment_date', [$startDate, $endDate])
            ->select(
                DB::raw('COUNT(*) as total_transactions'),
                DB::raw('SUM(amount) as total_revenue'),
                DB::raw('AVG(amount) as average_transaction'),
                'payment_method',
                DB::raw('COUNT(payment_method) as method_count')
            )
            ->groupBy('payment_method')
            ->get();
        
        // Total summary
        $totalRevenue = $salesSummary->sum('amount');
        $totalTransactions = $salesSummary->sum('total_transactions');
        $averageTransaction = $totalTransactions > 0 ? $totalRevenue / $totalTransactions : 0;
        
        // Daily sales for chart
        $dailySales = Sale::whereBetween('payment_date', [$startDate, $endDate])
            ->select(
                DB::raw('DATE(payment_date) as date'),
                DB::raw('SUM(amount) as total'),
                DB::raw('COUNT(*) as transactions')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get();
        
        // Top customers
        $topCustomers = Order::join('customers', 'orders.customer_id', '=', 'customers.id')
            ->join('sales', 'orders.id', '=', 'sales.order_id')
            ->whereBetween('sales.payment_date', [$startDate, $endDate])
            ->select(
                'customers.name',
                'customers.email',
                DB::raw('COUNT(orders.id) as order_count'),
                DB::raw('SUM(sales.amount) as total_spent')
            )
            ->groupBy('customers.id', 'customers.name', 'customers.email')
            ->orderBy('total_spent', 'desc')
            ->take(10)
            ->get();
        
        // Product performance
        $productPerformance = DB::table('order_items')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('sales', 'orders.id', '=', 'sales.order_id')
            ->whereBetween('sales.payment_date', [$startDate, $endDate])
            ->select(
                'products.name',
                DB::raw('SUM(order_items.quantity) as units_sold'),
                DB::raw('SUM(order_items.total_price) as revenue')
            )
            ->groupBy('products.id', 'products.name')
            ->orderBy('revenue', 'desc')
            ->take(10)
            ->get();
        
        return Inertia::render('reports/index', [
            'summary' => [
                'total_revenue' => $totalRevenue,
                'total_transactions' => $totalTransactions,
                'average_transaction' => $averageTransaction,
            ],
            'sales_by_method' => $salesSummary,
            'daily_sales' => $dailySales,
            'top_customers' => $topCustomers,
            'product_performance' => $productPerformance,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
        ]);
    }
}