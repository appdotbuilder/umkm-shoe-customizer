import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Customers', href: '/customers' },
];

interface Customer {
    id: number;
    name: string;
    email: string;
    phone?: string;
    city?: string;
    status: string;
    orders_count?: number;
    created_at: string;
}

interface Props {
    customers: {
        data: Customer[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
        meta: { from: number; to: number; total: number };
    };
    filters: {
        search?: string;
        status?: string;
    };
    [key: string]: unknown;
}

export default function CustomersIndex({ customers, filters }: Props) {
    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const search = formData.get('search') as string;
        const status = formData.get('status') as string;
        
        router.get('/customers', { search, status }, { preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Customers - Shoe Business" />

            <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">👥 Customers</h1>
                        <p className="text-gray-600 mt-1">Manage your customer database</p>
                    </div>
                    <Link href="/customers/create">
                        <Button>+ Add Customer</Button>
                    </Link>
                </div>

                {/* Search and Filter */}
                <div className="bg-white p-4 rounded-lg border mb-6">
                    <form onSubmit={handleSearch} className="flex gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                name="search"
                                placeholder="Search customers..."
                                defaultValue={filters.search}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <select
                                name="status"
                                defaultValue={filters.status}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                        <Button type="submit" variant="outline">Search</Button>
                    </form>
                </div>

                {/* Customers Table */}
                <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                    {customers.data.length > 0 ? (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Customer
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Contact
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Location
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Orders
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {customers.data.map((customer) => (
                                            <tr key={customer.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <div className="font-medium text-gray-900">{customer.name}</div>
                                                        <div className="text-sm text-gray-500">#{customer.id}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <div className="text-sm text-gray-900">{customer.email}</div>
                                                        {customer.phone && (
                                                            <div className="text-sm text-gray-500">{customer.phone}</div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    {customer.city || '-'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                        customer.status === 'active'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {customer.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    {customer.orders_count || 0}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Link href={`/customers/${customer.id}`}>
                                                            <Button variant="outline" size="sm">View</Button>
                                                        </Link>
                                                        <Link href={`/customers/${customer.id}/edit`}>
                                                            <Button variant="outline" size="sm">Edit</Button>
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Pagination */}
                            {customers.links && customers.links.length > 3 && (
                                <div className="px-6 py-3 border-t border-gray-200">
                                    <div className="flex justify-between items-center">
                                        <div className="text-sm text-gray-700">
                                            Showing {customers.meta.from || 0} to {customers.meta.to || 0} of {customers.meta.total} results
                                        </div>
                                        <div className="flex gap-1">
                                            {customers.links.map((link, index) => (
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
                            <div className="text-gray-400 text-6xl mb-4">👥</div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
                            <p className="text-gray-500 mb-4">
                                {filters.search || filters.status 
                                    ? 'No customers match your search criteria.'
                                    : 'Get started by adding your first customer.'
                                }
                            </p>
                            <Link href="/customers/create">
                                <Button>Add First Customer</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}