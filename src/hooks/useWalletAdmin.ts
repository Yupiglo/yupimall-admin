"use client";

import { useState, useEffect, useCallback } from "react";
import axiosInstance from "@/lib/axios";

export function useAllWallets(page = 1, perPage = 20) {
    const [wallets, setWallets] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetch = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get("wallet/all", { params: { page, per_page: perPage } });
            setWallets(res.data.wallets);
        } catch {
            setWallets(null);
        } finally {
            setLoading(false);
        }
    }, [page, perPage]);

    useEffect(() => { fetch(); }, [fetch]);
    return { wallets, loading, refresh: fetch };
}

export function useAllTransactions(page = 1, perPage = 30) {
    const [transactions, setTransactions] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetch = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get("wallet/transactions/all", { params: { page, per_page: perPage } });
            setTransactions(res.data.transactions);
        } catch {
            setTransactions(null);
        } finally {
            setLoading(false);
        }
    }, [page, perPage]);

    useEffect(() => { fetch(); }, [fetch]);
    return { transactions, loading, refresh: fetch };
}

export function useExchangeRates() {
    const [rates, setRates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetch = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get("exchange-rates");
            setRates(res.data.rates);
        } catch {
            setRates([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetch(); }, [fetch]);
    return { rates, loading, refresh: fetch };
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

    const fetch = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get("wallet/sellers");
            setSellers(res.data.sellers || []);
        } catch {
            setSellers([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetch(); }, [fetch]);
    return { sellers, loading, refresh: fetch };
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

    const fetch = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get("wallet/sellers/eligible", { params: { page, per_page: perPage, ...(search ? { search } : {}) } });
            setData(res.data.users);
        } catch {
            setData(null);
        } finally {
            setLoading(false);
        }
    }, [page, perPage, search]);

    useEffect(() => { fetch(); }, [fetch]);
    return { data, loading, refresh: fetch };
}

export async function toggleWalletSeller(userId: number, isWalletSeller: boolean, whatsapp?: string) {
    const res = await axiosInstance.post("wallet/sellers/update", {
        user_id: userId,
        is_wallet_seller: isWalletSeller,
        ...(whatsapp !== undefined ? { wallet_seller_whatsapp: whatsapp } : {}),
    });
    return res.data;
}
