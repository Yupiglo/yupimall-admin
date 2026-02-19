"use client";

import AppShell from "@/components/AppShell";
import { Box, Card, Stack, Typography, CircularProgress } from "@mui/material";
import { AccountBalanceWallet as WalletIcon } from "@mui/icons-material";
import { useAdminWalletBalance } from "@/hooks/useWalletAdmin";

export default function WalletsLayout({ children }: { children: React.ReactNode }) {
    const { balance, loading } = useAdminWalletBalance();

    return (
        <AppShell>
            <Box sx={{ px: { xs: 2, md: 3 }, pt: 2, pb: 1 }}>
                <Card variant="outlined" sx={{ borderRadius: 2, px: 2, py: 1.5, display: "inline-flex", bgcolor: "action.hover" }}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                        <WalletIcon fontSize="small" color="primary" />
                        <Typography variant="body2" fontWeight={700} color="text.secondary">Solde Admin:</Typography>
                        {loading ? (
                            <CircularProgress size={16} />
                        ) : (
                            <Typography variant="subtitle1" fontWeight={800} color="primary.main">
                                ${parseFloat(String(balance ?? 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </Typography>
                        )}
                    </Stack>
                </Card>
            </Box>
            {children}
        </AppShell>
    );
}
