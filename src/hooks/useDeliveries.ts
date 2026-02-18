"use client";

import { useState, useEffect, useCallback } from "react";
import axiosInstance from "@/lib/axios";

export interface DeliveryPerson {
    id: number;
    name: string;
    email: string;
    phone: string;
    vehicle?: string;
    totalDeliveries?: number;
    status: string;
}

export interface Delivery {
    id: number;
    orderId: string;
    customer: string;
    courier: string;
    address: string;
    date: string;
    status: string;
}

export function useDeliveryPersonnel() {
    const [personnel, setPersonnel] = useState<DeliveryPerson[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetch = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axiosInstance.get("delivery/personnel");
            const data = response.data?.personnel || response.data?.data || response.data || [];
            setPersonnel(Array.isArray(data) ? data : []);
        } catch (err: any) {
            console.error("Error fetching delivery personnel:", err);
            setError(err?.response?.data?.message || "Impossible de charger les livreurs");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetch(); }, [fetch]);

    return { personnel, loading, error, refresh: fetch };
}

export function useActiveDeliveries() {
    const [deliveries, setDeliveries] = useState<Delivery[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetch = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axiosInstance.get("delivery/active");
            const data = response.data?.deliveries || response.data?.data || response.data || [];
            setDeliveries(Array.isArray(data) ? data : []);
        } catch (err: any) {
            console.error("Error fetching deliveries:", err);
            setError(err?.response?.data?.message || "Impossible de charger les livraisons");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetch(); }, [fetch]);

    return { deliveries, loading, error, refresh: fetch };
}
