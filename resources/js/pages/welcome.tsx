import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

export default function Welcome() {
    const { auth } = usePage<{ auth: { user: { id: number; name: string } | null } }>().props;

    return (
        <>
            <Head title="Custom Shoe Business - UMKM Sepatu" />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
                {/* Header */}
                <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-90"></div>
                    <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <div className="mb-6">
                                <span className="text-6xl">👟</span>
                            </div>
                            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                                Custom Shoe Business
                            </h1>
                            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-blue-100">
                                Professional UMKM management system for custom shoe manufacturing. 
                                Design, order, and track your custom shoes with our modern platform.
                            </p>
                            <div className="mt-10 flex items-center justify-center gap-x-6">
                                {auth.user ? (
                                    <Link href="/dashboard">
                                        <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                                            Go to Dashboard
                                        </Button>
                                    </Link>
                                ) : (
                                    <div className="flex gap-4">
                                        <Link href="/login">
                                            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                                                Login
                                            </Button>
                                        </Link>
                                        <Link href="/register">
                                            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                                                Register
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="py-24 sm:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                Complete Shoe Business Management
                            </h2>
                            <p className="mt-4 text-lg leading-6 text-gray-600">
                                Everything you need to run a successful custom shoe business
                            </p>
                        </div>
                        
                        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                            <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
                                {/* Product Management */}
                                <div className="flex flex-col items-center">
                                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-blue-600 text-3xl text-white">
                                        📦
                                    </div>
                                    <h3 className="text-lg font-semibold leading-7 text-gray-900">Product Management</h3>
                                    <p className="mt-2 text-center text-sm leading-6 text-gray-600">
                                        Manage your shoe catalog with variations, pricing, and customization options.
                                    </p>
                                </div>

                                {/* Custom Design Feature */}
                                <div className="flex flex-col items-center">
                                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-indigo-600 text-3xl text-white">
                                        🎨
                                    </div>
                                    <h3 className="text-lg font-semibold leading-7 text-gray-900">Custom Design Tool</h3>
                                    <p className="mt-2 text-center text-sm leading-6 text-gray-600">
                                        Interactive shoe designer - customers can customize colors, materials, and patterns.
                                    </p>
                                </div>

                                {/* Order Management */}
                                <div className="flex flex-col items-center">
                                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-purple-600 text-3xl text-white">
                                        📋
                                    </div>
                                    <h3 className="text-lg font-semibold leading-7 text-gray-900">Order Tracking</h3>
                                    <p className="mt-2 text-center text-sm leading-6 text-gray-600">
                                        Track orders from design to delivery with real-time status updates.
                                    </p>
                                </div>

                                {/* Financial Reports */}
                                <div className="flex flex-col items-center">
                                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-green-600 text-3xl text-white">
                                        📊
                                    </div>
                                    <h3 className="text-lg font-semibold leading-7 text-gray-900">Financial Reports</h3>
                                    <p className="mt-2 text-center text-sm leading-6 text-gray-600">
                                        Generate comprehensive sales reports and track business performance.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Custom Design Preview */}
                <div className="bg-gray-50 py-24 sm:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                🎨 Custom Shoe Designer
                            </h2>
                            <p className="mt-4 text-lg leading-6 text-gray-600">
                                Let customers design their perfect shoes with our interactive tool
                            </p>
                        </div>
                        
                        <div className="mt-16 flex justify-center">
                            <div className="grid max-w-4xl grid-cols-1 gap-8 lg:grid-cols-3">
                                {/* Shoe Preview */}
                                <div className="col-span-2 rounded-xl bg-white p-8 shadow-sm">
                                    <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="text-8xl mb-4">👟</div>
                                            <p className="text-gray-600">3D Shoe Preview</p>
                                            <p className="text-sm text-gray-500">Interactive customization preview</p>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Customization Options */}
                                <div className="space-y-6">
                                    <div className="rounded-lg bg-white p-4 shadow-sm">
                                        <h4 className="font-medium text-gray-900">👆 Upper Material</h4>
                                        <p className="text-sm text-gray-600">Leather, Canvas, Synthetic</p>
                                    </div>
                                    <div className="rounded-lg bg-white p-4 shadow-sm">
                                        <h4 className="font-medium text-gray-900">🌈 Color Options</h4>
                                        <p className="text-sm text-gray-600">Custom colors & patterns</p>
                                    </div>
                                    <div className="rounded-lg bg-white p-4 shadow-sm">
                                        <h4 className="font-medium text-gray-900">👟 Sole Type</h4>
                                        <p className="text-sm text-gray-600">Rubber, EVA, Leather</p>
                                    </div>
                                    <div className="rounded-lg bg-white p-4 shadow-sm">
                                        <h4 className="font-medium text-gray-900">🔗 Lace Style</h4>
                                        <p className="text-sm text-gray-600">Standard, Rope, Elastic</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Business Benefits */}
                <div className="py-24 sm:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                Perfect for UMKM Shoe Businesses
                            </h2>
                        </div>
                        
                        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-2">
                            <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
                                <h3 className="text-xl font-semibold text-gray-900">📈 Increase Sales</h3>
                                <ul className="mt-4 space-y-3 text-sm text-gray-600">
                                    <li>• Custom design options attract more customers</li>
                                    <li>• Professional order management builds trust</li>
                                    <li>• Real-time tracking improves customer satisfaction</li>
                                    <li>• Detailed reports help optimize pricing</li>
                                </ul>
                            </div>
                            
                            <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
                                <h3 className="text-xl font-semibold text-gray-900">⚡ Streamline Operations</h3>
                                <ul className="mt-4 space-y-3 text-sm text-gray-600">
                                    <li>• Automated order processing saves time</li>
                                    <li>• Customer database keeps records organized</li>
                                    <li>• Financial reports simplify accounting</li>
                                    <li>• Production tracking prevents delays</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="bg-blue-600">
                    <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                                Ready to grow your shoe business?
                            </h2>
                            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-blue-100">
                                Join hundreds of UMKM businesses already using our platform to manage their custom shoe operations.
                            </p>
                            <div className="mt-10 flex items-center justify-center gap-x-6">
                                {auth.user ? (
                                    <Link href="/dashboard">
                                        <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                                            Access Dashboard →
                                        </Button>
                                    </Link>
                                ) : (
                                    <div className="flex gap-4">
                                        <Link href="/register">
                                            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                                                Get Started Free
                                            </Button>
                                        </Link>
                                        <Link href="/login">
                                            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                                                Sign In
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-white">
                    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
                        <div className="text-center">
                            <p className="text-sm leading-5 text-gray-500">
                                © 2024 Custom Shoe Business Management System. Built with Laravel & React.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}