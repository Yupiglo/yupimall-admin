"use client";

import { useState, useEffect, useCallback } from "react";
import axiosInstance from "@/lib/axios";

function extractError(err: any): string {
    const status = err.response?.status;
    const msg = err.response?.data?.message;
    if (status === 401) return "Session expirée. Veuillez vous reconnecter.";
    if (msg) return msg;
    return "Erreur réseau. Vérifiez votre connexion.";
}

export function useAllWallets(page = 1, perPage = 20) {
    const [wallets, setWallets] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetch = useCallback(async () => {
        try {
            setLoading(true); setError(null);
            const res = await axiosInstance.get("wallet/all", { params: { page, per_page: perPage } });
            setWallets(res.data.wallets);
        } catch (err: any) {
            setWallets(null);
            setError(extractError(err));
        } finally {
            setLoading(false);
        }
    }, [page, perPage]);

    useEffect(() => { fetch(); }, [fetch]);
    return { wallets, loading, error, refresh: fetch };
}

export function useAllTransactions(page = 1, perPage = 30) {
    const [transactions, setTransactions] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetch = useCallback(async () => {
        try {
            setLoading(true); setError(null);
            const res = await axiosInstance.get("wallet/transactions/all", { params: { page, per_page: perPage } });
            setTransactions(res.data.transactions);
        } catch (err: any) {
            setTransactions(null);
            setError(extractError(err));
        } finally {
            setLoading(false);
        }
    }, [page, perPage]);

    useEffect(() => { fetch(); }, [fetch]);
    return { transactions, loading, error, refresh: fetch };
}

export function useExchangeRates() {
    const [rates, setRates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetch = useCallback(async () => {
        try {
            setLoading(true); setError(null);
            const res = await axiosInstance.get("exchange-rates");
            setRates(res.data.rates);
        } catch (err: any) {
            setRates([]);
            setError(extractError(err));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetch(); }, [fetch]);
    return { rates, loading, error, refresh: fetch };
}

export async function rechargeWallet(walletId: number, amount: number) {
    const res = await axiosInstance.post("wallet/recharge", { wallet_id: walletId, amount });
    return res.data;
}

export async function rechargeWalletByUser(userId: number, amount: number) {
    const res = await axiosInstance.post("wallet/recharge", { user_id: userId, amount });
    return res.data;
}

export function useActiveSellers() {
    const [sellers, setSellers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetch = useCallback(async () => {
        try {
            setLoading(true); setError(null);
            const res = await axiosInstance.get("wallet/sellers");
            setSellers(res.data.sellers || []);
        } catch (err: any) {
            setSellers([]);
            setError(extractError(err));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetch(); }, [fetch]);
    return { sellers, loading, error, refresh: fetch };
}

export async function createExchangeRate(fromCurrency: string, rate: number) {
    const res = await axiosInstance.post("exchange-rates", { from_currency: fromCurrency, rate });
    return res.data;
}

export async function generateTreasury(amount: number, adminUserId: number) {
    const res = await axiosInstance.post("wallet/treasury/generate", { amount, admin_user_id: adminUserId });
    return res.data;
}

export function useEligibleSellers(page = 1, perPage = 30, search = "") {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetch = useCallback(async () => {
        try {
            setLoading(true); setError(null);
            const res = await axiosInstance.get("wallet/sellers/eligible", { params: { page, per_page: perPage, ...(search ? { search } : {}) } });
            setData(res.data.users);
        } catch (err: any) {
            setData(null);
            setError(extractError(err));
        } finally {
            setLoading(false);
        }
    }, [page, perPage, search]);

    useEffect(() => { fetch(); }, [fetch]);
    return { data, loading, error, refresh: fetch };
}

export async function toggleWalletSeller(userId: number, isWalletSeller: boolean, whatsapp?: string) {
    const res = await axiosInstance.post("wallet/sellers/update", {
        user_id: userId,
        is_wallet_seller: isWalletSeller,
        ...(whatsapp !== undefined ? { wallet_seller_whatsapp: whatsapp } : {}),
    });
    return res.data;
}

export function useAllPins(page = 1, perPage = 30, sellerId?: number, status?: string) {
    const [pins, setPins] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetch = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const params: Record<string, unknown> = { page, per_page: perPage };
            if (sellerId) params.seller_id = sellerId;
            if (status) params.status = status;
            const res = await axiosInstance.get("wallet/pins/all", { params });
            setPins(res.data.pins);
        } catch (err: any) {
            setPins(null);
            setError(extractError(err));
        } finally {
            setLoading(false);
        }
    }, [page, perPage, sellerId, status]);

    useEffect(() => {
        fetch();
    }, [fetch]);
    return { pins, loading, error, refresh: fetch };
}

export async function refundPin(pinId: number, reason?: string) {
    const res = await axiosInstance.post(`wallet/pins/${pinId}/refund`, reason ? { reason } : {});
    return res.data;
}
