import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ShoeDesigner } from '@/components/shoe-designer';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Orders', href: '/orders' },
    { title: 'Create Order', href: '/orders/create' },
];

interface Customer {
    id: number;
    name: string;
    email: string;
}

interface Product {
    id: number;
    name: string;
    base_price: number;
    available_sizes: string[];
    available_colors: string[];
    is_customizable: boolean;
    category: {
        name: string;
    };
}

interface OrderItem {
    id: string;
    product_id: number;
    product: Product;
    quantity: number;
    size: string;
    color: string;
    customizations?: Record<string, unknown>;
    special_notes?: string;
}

interface Props {
    customers: Customer[];
    products: Product[];
    [key: string]: unknown;
}

export default function CreateOrder({ customers, products }: Props) {
    const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [discountAmount, setDiscountAmount] = useState<number>(0);
    const [notes, setNotes] = useState<string>('');
    const [expectedDelivery, setExpectedDelivery] = useState<string>('');
    const [activeDesigner, setActiveDesigner] = useState<string | null>(null);

    const addOrderItem = () => {
        const newItem: OrderItem = {
            id: Date.now().toString(),
            product_id: products[0]?.id || 0,
            product: products[0],
            quantity: 1,
            size: products[0]?.available_sizes[0] || '',
            color: products[0]?.available_colors[0] || '',
            customizations: undefined,
            special_notes: '',
        };
        setOrderItems([...orderItems, newItem]);
    };

    const updateOrderItem = (id: string, updates: Partial<OrderItem>) => {
        setOrderItems(items =>
            items.map(item => {
                if (item.id === id) {
                    const updatedItem = { ...item, ...updates };
                    if (updates.product_id) {
                        const product = products.find(p => p.id === updates.product_id);
                        if (product) {
                            updatedItem.product = product;
                            updatedItem.size = product.available_sizes[0] || '';
                            updatedItem.color = product.available_colors[0] || '';
                            updatedItem.customizations = undefined;
                        }
                    }
                    return updatedItem;
                }
                return item;
            })
        );
    };

    const removeOrderItem = (id: string) => {
        setOrderItems(items => items.filter(item => item.id !== id));
    };

    const updateCustomizations = (itemId: string, customizations: Record<string, unknown>) => {
        updateOrderItem(itemId, { customizations });
    };

    const calculateSubtotal = () => {
        return orderItems.reduce((sum, item) => {
            return sum + (item.product.base_price * item.quantity);
        }, 0);
    };

    const calculateTax = (subtotal: number) => {
        return subtotal * 0.11; // 11% tax
    };

    const calculateTotal = () => {
        const subtotal = calculateSubtotal();
        const tax = calculateTax(subtotal);
        return subtotal + tax - discountAmount;
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!selectedCustomer || orderItems.length === 0) {
            alert('Please select a customer and add at least one item.');
            return;
        }

        const orderData = {
            customer_id: selectedCustomer,
            items: orderItems.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity,
                size: item.size,
                color: item.color,
                customizations: item.customizations ? JSON.stringify(item.customizations) : null,
                special_notes: item.special_notes,
            })),
            discount_amount: discountAmount,
            notes,
            expected_delivery: expectedDelivery || null,
        };

        router.post('/orders', orderData);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Order - Shoe Business" />

            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">📦 Create New Order</h1>
                        <p className="text-gray-600 mt-1">Create a custom shoe order with design options</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Customer Selection */}
                    <div className="bg-white p-6 rounded-lg border">
                        <h3 className="text-lg font-semibold mb-4">👥 Customer Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Customer *
                                </label>
                                <select
                                    value={selectedCustomer || ''}
                                    onChange={(e) => setSelectedCustomer(Number(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Choose a customer</option>
                                    {customers.map((customer) => (
                                        <option key={customer.id} value={customer.id}>
                                            {customer.name} - {customer.email}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Expected Delivery Date
                                </label>
                                <input
                                    type="date"
                                    value={expectedDelivery}
                                    onChange={(e) => setExpectedDelivery(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-white p-6 rounded-lg border">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">👟 Order Items</h3>
                            <Button type="button" onClick={addOrderItem} variant="outline">
                                + Add Item
                            </Button>
                        </div>

                        {orderItems.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <div className="text-4xl mb-2">👟</div>
                                <p>No items added yet</p>
                                <p className="text-sm">Click "Add Item" to start building the order</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {orderItems.map((item, index) => (
                                    <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="font-medium">Item {index + 1}</h4>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => removeOrderItem(item.id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Remove
                                            </Button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Product *
                                                </label>
                                                <select
                                                    value={item.product_id}
                                                    onChange={(e) => updateOrderItem(item.id, { product_id: Number(e.target.value) })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    required
                                                >
                                                    {products.map((product) => (
                                                        <option key={product.id} value={product.id}>
                                                            {product.name} - {formatCurrency(product.base_price)}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Quantity *
                                                </label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={(e) => updateOrderItem(item.id, { quantity: Number(e.target.value) })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Size *
                                                </label>
                                                <select
                                                    value={item.size}
                                                    onChange={(e) => updateOrderItem(item.id, { size: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    required
                                                >
                                                    {item.product.available_sizes.map((size) => (
                                                        <option key={size} value={size}>
                                                            {size}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Color *
                                                </label>
                                                <select
                                                    value={item.color}
                                                    onChange={(e) => updateOrderItem(item.id, { color: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    required
                                                >
                                                    {item.product.available_colors.map((color) => (
                                                        <option key={color} value={color}>
                                                            {color}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        {/* Custom Design Section */}
                                        {item.product.is_customizable && (
                                            <div className="border-t border-gray-200 pt-4">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h5 className="font-medium text-purple-700">🎨 Custom Design Options</h5>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setActiveDesigner(activeDesigner === item.id ? null : item.id)}
                                                    >
                                                        {activeDesigner === item.id ? 'Close Designer' : 'Open Designer'}
                                                    </Button>
                                                </div>

                                                {activeDesigner === item.id && (
                                                    <div className="bg-purple-50 p-4 rounded-lg">
                                                        <ShoeDesigner
                                                            onDesignChange={(design) => updateCustomizations(item.id, design)}
                                                            initialDesign={(item.customizations as Record<string, string>) || {}}
                                                        />
                                                    </div>
                                                )}

                                                {item.customizations && (
                                                    <div className="bg-gray-50 p-3 rounded mt-4">
                                                        <p className="text-sm font-medium text-gray-700 mb-2">Current Design:</p>
                                                        <div className="text-sm text-gray-600 space-y-1">
                                                            <p>• Upper: {(item.customizations.upper as string) || ''}</p>
                                                            <p>• Sole: {(item.customizations.sole as string) || ''}</p>
                                                            <p>• Laces: {(item.customizations.laces as string) || ''}</p>
                                                            <p>• Color: {(item.customizations.color as string) || ''}</p>
                                                            {item.customizations.logoText ? (
                                                                <p>• Logo: {item.customizations.logoText.toString()}</p>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <div className="mt-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Special Notes
                                            </label>
                                            <textarea
                                                value={item.special_notes || ''}
                                                onChange={(e) => updateOrderItem(item.id, { special_notes: e.target.value })}
                                                rows={2}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Any special instructions for this item..."
                                            />
                                        </div>

                                        <div className="mt-4 text-right">
                                            <p className="text-lg font-semibold">
                                                Item Total: {formatCurrency(item.product.base_price * item.quantity)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Order Summary */}
                    {orderItems.length > 0 && (
                        <div className="bg-white p-6 rounded-lg border">
                            <h3 className="text-lg font-semibold mb-4">💰 Order Summary</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Discount Amount
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={discountAmount}
                                            onChange={(e) => setDiscountAmount(Number(e.target.value))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="0"
                                        />
                                    </div>
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Order Notes
                                        </label>
                                        <textarea
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Additional notes for this order..."
                                        />
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span>Subtotal:</span>
                                            <span>{formatCurrency(calculateSubtotal())}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Tax (11%):</span>
                                            <span>{formatCurrency(calculateTax(calculateSubtotal()))}</span>
                                        </div>
                                        {discountAmount > 0 && (
                                            <div className="flex justify-between text-red-600">
                                                <span>Discount:</span>
                                                <span>-{formatCurrency(discountAmount)}</span>
                                            </div>
                                        )}
                                        <div className="border-t border-gray-300 pt-2">
                                            <div className="flex justify-between text-lg font-semibold">
                                                <span>Total:</span>
                                                <span>{formatCurrency(calculateTotal())}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex justify-end gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.get('/orders')}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={!selectedCustomer || orderItems.length === 0}>
                            Create Order
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}