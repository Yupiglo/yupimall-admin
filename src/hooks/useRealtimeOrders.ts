"use client";

import { useEffect, useState, useCallback } from "react";
import { getEcho } from "@/lib/echo";

interface OrderEvent {
    id: number;
    tracking_code: string;
    user_name: string;
    total: number;
    status: string;
    created_at: string;
}

export function useRealtimeOrders(onNewOrder?: (order: OrderEvent) => void) {
    const [isConnected, setIsConnected] = useState(false);
    const [latestOrder, setLatestOrder] = useState<OrderEvent | null>(null);

    const handleNewOrder = useCallback(
        (event: OrderEvent) => {
            setLatestOrder(event);
            onNewOrder?.(event);
        },
        [onNewOrder]
    );

    useEffect(() => {
        const echo = getEcho();
        if (!echo) return;

        const channel = echo.channel("orders");

        channel.listen("OrderCreated", (event: OrderEvent) => {
            console.log("[WebSocket] New order received:", event);
            handleNewOrder(event);
        });

        setIsConnected(true);

        return () => {
            echo.leaveChannel("orders");
            setIsConnected(false);
        };
    }, [handleNewOrder]);

    return { isConnected, latestOrder };
}
