"use client";

import { useState } from "react";
import {
    Box, Typography, Card, CardContent, Button, CircularProgress, Stack, Chip,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
} from "@mui/material";
import { useAllWallets } from "@/hooks/useWalletAdmin";
import { useRouter } from "next/navigation";

export default function WalletsOverview() {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const { wallets, loading } = useAllWallets(page, 20);

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={900}>Gestion des Wallets</Typography>
                <Stack direction="row" spacing={2}>
                    <Button variant="contained" onClick={() => router.push("/wallets/recharge")} sx={{ borderRadius: 3, fontWeight: 700, textTransform: "none" }}>
                        Recharger un Wallet
                    </Button>
                    <Button variant="contained" color="secondary" onClick={() => router.push("/wallets/sellers")} sx={{ borderRadius: 3, fontWeight: 700, textTransform: "none" }}>
                        Gérer Vendeurs
                    </Button>
                    <Button variant="outlined" onClick={() => router.push("/wallets/exchange-rates")} sx={{ borderRadius: 3, fontWeight: 700, textTransform: "none" }}>
                        Taux de change
                    </Button>
                    <Button variant="outlined" onClick={() => router.push("/wallets/transactions")} sx={{ borderRadius: 3, fontWeight: 700, textTransform: "none" }}>
                        Audit Transactions
                    </Button>
                </Stack>
            </Stack>

            <Card sx={{ borderRadius: 4 }}>
                <CardContent sx={{ p: 0 }}>
                    {loading ? (
                        <Box sx={{ textAlign: "center", py: 6 }}><CircularProgress /></Box>
                    ) : !wallets?.data?.length ? (
                        <Typography color="text.secondary" sx={{ textAlign: "center", py: 6 }}>Aucun wallet trouvé</Typography>
                    ) : (
                        <>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 800 }}>ID</TableCell>
                                            <TableCell sx={{ fontWeight: 800 }}>Utilisateur</TableCell>
                                            <TableCell sx={{ fontWeight: 800 }}>Rôle</TableCell>
                                            <TableCell sx={{ fontWeight: 800 }}>Solde</TableCell>
                                            <TableCell sx={{ fontWeight: 800 }}>Devise</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {wallets.data.map((w: any) => (
                                            <TableRow key={w.id} hover>
                                                <TableCell>{w.id}</TableCell>
                                                <TableCell>
                                                    <Typography fontWeight={700}>{w.user?.name || w.user?.username || "—"}</Typography>
                                                    <Typography variant="caption" color="text.secondary">{w.user?.email}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip label={w.user?.role || "—"} size="small" sx={{ fontWeight: 700, fontSize: "0.7rem", textTransform: "uppercase" }} />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography fontWeight={800} color={parseFloat(w.balance) > 0 ? "success.main" : "text.secondary"}>
                                                        ${parseFloat(w.balance).toLocaleString()}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{w.currency}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                component="div"
                                count={wallets.total}
                                page={page - 1}
                                onPageChange={(_, p) => setPage(p + 1)}
                                rowsPerPage={wallets.per_page}
                                rowsPerPageOptions={[]}
                            />
                        </>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
}
