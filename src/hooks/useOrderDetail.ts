"use client";

import { useState, useEffect, useCallback } from "react";
import axiosInstance from "@/lib/axios";

interface Order {
    id: number;
    trackingCode: string;
    status: string;
    isPaid: boolean;
    isDelivered: boolean;
    total: number;
    customer: string;
    customerEmail?: string;
    shippingAddress?: {
        street?: string;
        city?: string;
        phone?: string;
        country?: string;
    };
    paymentMethod?: string;
    paidAt?: string;
    deliveredAt?: string;
    createdAt: string;
    items: any[];
}

export function useOrderDetail(id: string) {
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updating, setUpdating] = useState(false);

    const fetchOrder = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`orders/${id}`);
            if (response.data.message === 'success') {
                const data = response.data.order;
                // Map cartItem to items for UI compatibility
                const mappedOrder: Order = {
                    ...data,
                    items: data.cartItem?.map((ci: any) => ({
                        product: typeof ci.productId === 'object' ? ci.productId : { title: 'Produit', price: ci.price },
                        quantity: ci.quantity,
                        price: ci.price,
                        totalPrice: ci.price * ci.quantity
                    })) || []
                };
                setOrder(mappedOrder);
            }
        } catch (err) {
            console.error("Error fetching order:", err);
            setError("Failed to load order details");
        } finally {
            setLoading(false);
        }
    }, [id]);

    const updateStatus = async (status: string) => {
        try {
            setUpdating(true);
            const response = await axiosInstance.put(`orders/${id}/status`, { status });
            if (response.data.message === 'success') {
                // Refresh local data
                setOrder((prev: Order | null) => prev ? ({ ...prev, status }) : null);
                return true;
            }
        } catch (err) {
            console.error("Error updating order status:", err);
            return false;
        } finally {
            setUpdating(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchOrder();
        }
    }, [id, fetchOrder]);

    return { order, loading, error, updating, updateStatus, refresh: fetchOrder };
}
