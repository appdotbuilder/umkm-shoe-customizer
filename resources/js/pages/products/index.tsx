import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Products', href: '/products' },
];

interface Product {
    id: number;
    name: string;
    description?: string;
    base_price: number;
    category: {
        name: string;
    };
    available_sizes: string[];
    available_colors: string[];
    is_customizable: boolean;
    active: boolean;
    image_url?: string;
}

interface Category {
    id: number;
    name: string;
}

interface Props {
    products: {
        data: Product[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
        meta: { from: number; to: number; total: number };
    };
    categories: Category[];
    filters: {
        search?: string;
        category?: string;
        customizable?: string;
    };
    [key: string]: unknown;
}

export default function ProductsIndex({ products, categories, filters }: Props) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const search = formData.get('search') as string;
        const category = formData.get('category') as string;
        const customizable = formData.get('customizable') as string;
        
        router.get('/products', { search, category, customizable }, { preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products - Shoe Business" />

            <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">👟 Products</h1>
                        <p className="text-gray-600 mt-1">Manage your shoe catalog and customization options</p>
                    </div>
                    <Link href="/products/create">
                        <Button>+ Add Product</Button>
                    </Link>
                </div>

                {/* Search and Filter */}
                <div className="bg-white p-4 rounded-lg border mb-6">
                    <form onSubmit={handleSearch} className="flex gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                name="search"
                                placeholder="Search products..."
                                defaultValue={filters.search}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <select
                                name="category"
                                defaultValue={filters.category}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Categories</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <select
                                name="customizable"
                                defaultValue={filters.customizable}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Products</option>
                                <option value="1">Customizable Only</option>
                                <option value="0">Standard Only</option>
                            </select>
                        </div>
                        <Button type="submit" variant="outline">Search</Button>
                    </form>
                </div>

                {/* Products Grid */}
                <div className="bg-white rounded-lg border shadow-sm">
                    {products.data.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
                                {products.data.map((product) => (
                                    <div key={product.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                                        {/* Product Image */}
                                        <div className="aspect-square bg-gray-100 flex items-center justify-center relative">
                                            {product.image_url ? (
                                                <img 
                                                    src={product.image_url} 
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="text-6xl">👟</div>
                                            )}
                                            {product.is_customizable && (
                                                <div className="absolute top-2 right-2 bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                                    🎨 Custom
                                                </div>
                                            )}
                                            {!product.active && (
                                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                                    <span className="text-white font-medium">Inactive</span>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Product Info */}
                                        <div className="p-4">
                                            <div className="mb-2">
                                                <h3 className="font-medium text-gray-900 line-clamp-2">{product.name}</h3>
                                                <p className="text-sm text-gray-500">{product.category.name}</p>
                                            </div>
                                            
                                            <div className="mb-3">
                                                <p className="text-lg font-semibold text-gray-900">
                                                    {formatPrice(product.base_price)}
                                                </p>
                                                {product.is_customizable && (
                                                    <p className="text-xs text-purple-600">+ customization options</p>
                                                )}
                                            </div>
                                            
                                            {/* Available Options */}
                                            <div className="mb-3 space-y-1">
                                                <div className="flex items-center text-xs text-gray-500">
                                                    <span className="mr-1">📏</span>
                                                    <span>Sizes: {product.available_sizes.join(', ')}</span>
                                                </div>
                                                <div className="flex items-center text-xs text-gray-500">
                                                    <span className="mr-1">🎨</span>
                                                    <span>Colors: {product.available_colors.length} options</span>
                                                </div>
                                            </div>
                                            
                                            {/* Actions */}
                                            <div className="flex gap-2">
                                                <Link href={`/products/${product.id}`} className="flex-1">
                                                    <Button variant="outline" size="sm" className="w-full">
                                                        View
                                                    </Button>
                                                </Link>
                                                <Link href={`/products/${product.id}/edit`} className="flex-1">
                                                    <Button size="sm" className="w-full">
                                                        Edit
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Pagination */}
                            {products.links && products.links.length > 3 && (
                                <div className="px-6 py-3 border-t border-gray-200">
                                    <div className="flex justify-between items-center">
                                        <div className="text-sm text-gray-700">
                                            Showing {products.meta.from || 0} to {products.meta.to || 0} of {products.meta.total} results
                                        </div>
                                        <div className="flex gap-1">
                                            {products.links.map((link, index) => (
                                                link.url ? (
                                                    <button
                                                        key={index}
                                                        onClick={() => router.get(link.url!)}
                                                        className={`px-3 py-1 text-sm rounded ${
                                                            link.active
                                                                ? 'bg-blue-500 text-white'
                                                                : 'bg-white text-gray-700 hover:bg-gray-50'
                                                        }`}
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                ) : null
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-gray-400 text-6xl mb-4">👟</div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                            <p className="text-gray-500 mb-4">
                                {filters.search || filters.category || filters.customizable
                                    ? 'No products match your search criteria.'
                                    : 'Get started by adding your first product to the catalog.'
                                }
                            </p>
                            <Link href="/products/create">
                                <Button>Add First Product</Button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Custom Design Feature Highlight */}
                <div className="mt-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-semibold mb-2">🎨 Custom Shoe Designer</h3>
                            <p className="text-purple-100">
                                Enable customers to design their perfect shoes with our interactive customization tool.
                                Set products as "customizable" to offer unique design options.
                            </p>
                        </div>
                        <div className="ml-6">
                            <div className="text-4xl mb-2">👟</div>
                            <div className="text-xs text-purple-200">Interactive Preview</div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}