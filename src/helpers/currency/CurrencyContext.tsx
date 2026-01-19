"use client";

import { createContext, useCallback, useEffect, useMemo, useState } from "react";

interface CurrencyType {
    currency: string;
    symbol: string;
    flag: string;
    value: number;
}

interface ContextProps {
    selectedCurrency: (cur: Partial<CurrencyType>) => void;
    selectedCurr: CurrencyType;
    currencies: CurrencyType[];
}

export const Context = createContext({} as ContextProps);

export const Provider = (props: { children: React.ReactNode }) => {
    // USD par défaut pour les panels admin
    const DEFAULT_CURRENCY = useMemo(() => ({ currency: "USD", symbol: "$", flag: "🇺🇸", value: 1 }), []);

    const CURRENCY_META = useMemo(
        () => [
            { currency: "USD", symbol: "$", flag: "🇺🇸" },
            { currency: "EUR", symbol: "€", flag: "🇪🇺" },
            { currency: "XOF", symbol: "FCFA", flag: "🇸🇳" },
            { currency: "XAF", symbol: "FCFA", flag: "🇨🇲" },
            { currency: "NGN", symbol: "₦", flag: "🇳🇬" },
            { currency: "GHS", symbol: "GH₵", flag: "🇬🇭" },
            { currency: "MAD", symbol: "د.م.", flag: "🇲🇦" },
            { currency: "DZD", symbol: "د.ج", flag: "🇩🇿" },
            { currency: "TND", symbol: "د.ت", flag: "🇹🇳" },
            { currency: "EGP", symbol: "£", flag: "🇪🇬" },
            { currency: "ZAR", symbol: "R", flag: "🇿🇦" },
            { currency: "KES", symbol: "KSh", flag: "🇰🇪" },
        ],
        []
    );

    // List of currencies with fixed rates as per user request
    const FIXED_RATES: Record<string, number> = {
        USD: 1,
        EUR: 0.9333, // 1 USD = 0.9333 EUR (Derived from 1€ = 750 FCFA / 700 FCFA/$)
        XOF: 700,
        XAF: 700,
        NGN: 1000,
        GHS: 13.5,
        MAD: 10,
        DZD: 134,
        TND: 3.1,
        EGP: 30.9,
        ZAR: 18.8,
        KES: 153,
    };

    const [rates, setRates] = useState<Record<string, number> | null>(FIXED_RATES);
    const [selectedCurr, setSelectedCurr] = useState(DEFAULT_CURRENCY);

    // List of currencies with their rates
    const currencies = useMemo(() => {
        return CURRENCY_META.map((meta) => ({
            currency: meta.currency,
            symbol: meta.symbol,
            flag: meta.flag,
            value: rates?.[meta.currency] ?? 1,
        }));
    }, [CURRENCY_META, rates]);

    // Function to change currency
    const selectedCurrency = useCallback(
        (cur: Partial<CurrencyType>) => {
            const currencyCode = String(cur?.currency || DEFAULT_CURRENCY.currency).toUpperCase();
            const meta = CURRENCY_META.find((m) => m.currency === currencyCode);
            const symbol = String(cur?.symbol || meta?.symbol || DEFAULT_CURRENCY.symbol);
            const flag = String(cur?.flag || meta?.flag || "🇺🇸");
            const computedValue = rates?.[currencyCode];
            const value = typeof computedValue === "number" ? computedValue : typeof cur?.value === "number" ? cur.value : 1;
            const next = { currency: currencyCode, symbol, flag, value };

            setSelectedCurr(next);
            try {
                if (typeof window !== "undefined") {
                    localStorage.setItem("admin_selected_currency", JSON.stringify(next));
                }
            } catch {
                // Ignore localStorage errors
            }
        },
        [CURRENCY_META, DEFAULT_CURRENCY.currency, DEFAULT_CURRENCY.symbol, rates]
    );

    // Effect to update selected currency value if rates change (static now)
    useEffect(() => {
        if (!rates) return;
        setSelectedCurr((prev) => {
            const computedValue = rates?.[prev.currency];
            if (typeof computedValue !== "number" || computedValue === prev.value) return prev;
            return { ...prev, value: computedValue };
        });
    }, [rates]);

    // Charger la devise sauvegardée ou utiliser USD par défaut
    useEffect(() => {
        if (typeof window === "undefined") return;

        try {
            const cached = localStorage.getItem("admin_selected_currency");
            if (cached) {
                const parsed = JSON.parse(cached);
                if (parsed && typeof parsed.currency === "string" && typeof parsed.symbol === "string" && typeof parsed.value === "number") {
                    const meta = CURRENCY_META.find((m) => m.currency === parsed.currency);
                    const flag = parsed.flag || meta?.flag || "🏳️";
                    setSelectedCurr({ ...parsed, flag });
                    return;
                }
            }
        } catch {
            // Ignore localStorage errors
        }

        // Pas de devise sauvegardée, utiliser USD par défaut
        setSelectedCurr(DEFAULT_CURRENCY);
    }, [DEFAULT_CURRENCY, CURRENCY_META]);

    const currencyContext = {
        selectedCurr,
        selectedCurrency,
        currencies,
    };

    return <Context.Provider value={currencyContext}>{props.children}</Context.Provider>;
};

export const { Consumer } = Context;

export { Context as CurrencyContext, Provider as CurrencyContextProvider };
