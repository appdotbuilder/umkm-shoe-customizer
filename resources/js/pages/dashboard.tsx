import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface Order {
    id: number;
    order_number: string;
    customer: { name: string };
    total_amount: number;
    status: string;
}

interface Product {
    id: number;
    name: string;
    base_price: number;
    total_sold: number;
    is_customizable: boolean;
}

interface DashboardProps {
    metrics?: {
        totalCustomers: number;
        totalProducts: number;
        totalOrders: number;
        monthlyRevenue: number;
    };
    recentOrders?: Order[];
    topProducts?: Product[];
    [key: string]: unknown;
}

export default function Dashboard({ metrics, recentOrders = [], topProducts = [] }: DashboardProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    // Default values if no data provided
    const defaultMetrics = {
        totalCustomers: 0,
        totalProducts: 0,
        totalOrders: 0,
        monthlyRevenue: 0,
    };

    const currentMetrics = metrics || defaultMetrics;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard - Shoe Business" />

            <div className="p-6 space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">👟 Shoe Business Dashboard</h1>
                        <p className="text-gray-600 mt-2">Welcome to your custom shoe business management system</p>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/orders/create">
                            <Button>+ New Order</Button>
                        </Link>
                        <Link href="/products/create">
                            <Button variant="outline">+ Add Product</Button>
                        </Link>
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg border">
                        <div className="p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-2xl">
                                        👥
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total Customers</p>
                                    <p className="text-2xl font-semibold text-gray-900">{currentMetrics.totalCustomers}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm rounded-lg border">
                        <div className="p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center text-2xl">
                                        👟
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Products</p>
                                    <p className="text-2xl font-semibold text-gray-900">{currentMetrics.totalProducts}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm rounded-lg border">
                        <div className="p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center text-2xl">
                                        📦
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                                    <p className="text-2xl font-semibold text-gray-900">{currentMetrics.totalOrders}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm rounded-lg border">
                        <div className="p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-2xl">
                                        💰
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                                    <p className="text-2xl font-semibold text-gray-900">
                                        {formatCurrency(currentMetrics.monthlyRevenue)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Orders & Top Products */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Orders */}
                    <div className="bg-white shadow-sm rounded-lg border">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium text-gray-900">📋 Recent Orders</h3>
                                <Link href="/orders" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                    View all
                                </Link>
                            </div>
                        </div>
                        <div className="p-6">
                            {recentOrders.length > 0 ? (
                                <div className="space-y-4">
                                    {recentOrders.map((order) => (
                                        <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-900">{order.order_number}</p>
                                                <p className="text-sm text-gray-600">{order.customer.name}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-gray-900">
                                                    {formatCurrency(order.total_amount)}
                                                </p>
                                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                                    order.status === 'delivered' 
                                                        ? 'bg-green-100 text-green-800'
                                                        : order.status === 'pending'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <div className="text-4xl mb-2">📦</div>
                                    <p>No orders yet</p>
                                    <Link href="/orders/create">
                                        <Button className="mt-3" size="sm">Create First Order</Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Top Products */}
                    <div className="bg-white shadow-sm rounded-lg border">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium text-gray-900">🏆 Top Products</h3>
                                <Link href="/products" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                    View all
                                </Link>
                            </div>
                        </div>
                        <div className="p-6">
                            {topProducts.length > 0 ? (
                                <div className="space-y-4">
                                    {topProducts.map((product) => (
                                        <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-900">{product.name}</p>
                                                <p className="text-sm text-gray-600">
                                                    {formatCurrency(product.base_price)}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-gray-900">
                                                    {product.total_sold} sold
                                                </p>
                                                {product.is_customizable && (
                                                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                                                        Custom
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <div className="text-4xl mb-2">👟</div>
                                    <p>No products yet</p>
                                    <Link href="/products/create">
                                        <Button className="mt-3" size="sm">Add First Product</Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg">
                    <div className="px-6 py-8">
                        <h3 className="text-xl font-semibold text-white mb-4">🚀 Quick Actions</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Link href="/customers/create">
                                <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">
                                    👥 Add Customer
                                </Button>
                            </Link>
                            <Link href="/products/create">
                                <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">
                                    👟 Add Product
                                </Button>
                            </Link>
                            <Link href="/orders/create">
                                <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">
                                    📦 New Order
                                </Button>
                            </Link>
                            <Link href="/reports">
                                <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">
                                    📊 View Reports
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}