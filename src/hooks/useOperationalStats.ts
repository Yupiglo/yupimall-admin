"use client";

import { useState, useEffect, useCallback } from "react";
import axiosInstance from "@/lib/axios";

export function useOperationalStats() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get("admin/stats");
            if (response.data) {
                setData(response.data);
            }
        } catch (err) {
            console.error("Error fetching admin stats:", err);
            setError("Impossible de charger les statistiques");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return { data, loading, error, refresh: fetchStats };
}
