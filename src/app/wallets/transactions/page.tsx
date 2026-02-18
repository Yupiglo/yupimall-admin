"use client";

import { useState } from "react";
import {
    Box, Typography, Card, CardContent, Chip, Button, CircularProgress,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
} from "@mui/material";
import { ArrowBack as BackIcon } from "@mui/icons-material";
import { useAllTransactions } from "@/hooks/useWalletAdmin";
import { useRouter } from "next/navigation";

const typeConfig: Record<string, { color: "error" | "success" | "info"; label: string }> = {
    debit: { color: "error", label: "Débit" },
    credit: { color: "success", label: "Crédit" },
    refund: { color: "info", label: "Remboursement" },
};

const refLabels: Record<string, string> = {
    pin_generation: "Génération PIN",
    pin_usage: "Utilisation PIN",
    pin_expiry: "Expiration PIN",
    pin_remainder: "Reste PIN",
    recharge: "Recharge",
    treasury: "Trésorerie",
};

export default function AuditTransactionsPage() {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const { transactions, loading } = useAllTransactions(page, 30);

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            <Button startIcon={<BackIcon />} onClick={() => router.push("/wallets")} sx={{ mb: 3, textTransform: "none", fontWeight: 700 }}>
                Retour aux Wallets
            </Button>

            <Typography variant="h4" fontWeight={900} sx={{ mb: 4 }}>Audit — Toutes les transactions</Typography>

            <Card sx={{ borderRadius: 4 }}>
                <CardContent sx={{ p: 0 }}>
                    {loading ? (
                        <Box sx={{ textAlign: "center", py: 6 }}><CircularProgress /></Box>
                    ) : !transactions?.data?.length ? (
                        <Typography color="text.secondary" sx={{ textAlign: "center", py: 6 }}>Aucune transaction</Typography>
                    ) : (
                        <>
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 800 }}>Utilisateur</TableCell>
                                            <TableCell sx={{ fontWeight: 800 }}>Type</TableCell>
                                            <TableCell sx={{ fontWeight: 800 }}>Montant</TableCell>
                                            <TableCell sx={{ fontWeight: 800 }}>Référence</TableCell>
                                            <TableCell sx={{ fontWeight: 800 }}>Description</TableCell>
                                            <TableCell sx={{ fontWeight: 800 }}>Solde avant</TableCell>
                                            <TableCell sx={{ fontWeight: 800 }}>Solde après</TableCell>
                                            <TableCell sx={{ fontWeight: 800 }}>Date</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {transactions.data.map((tx: any) => {
                                            const cfg = typeConfig[tx.type] || typeConfig.debit;
                                            const user = tx.wallet?.user;
                                            return (
                                                <TableRow key={tx.id} hover>
                                                    <TableCell>
                                                        <Typography variant="body2" fontWeight={700}>{user?.name || user?.username || "—"}</Typography>
                                                        <Typography variant="caption" color="text.secondary">{user?.role}</Typography>
                                                    </TableCell>
                                                    <TableCell><Chip label={cfg.label} color={cfg.color} size="small" sx={{ fontWeight: 700, fontSize: "0.65rem" }} /></TableCell>
                                                    <TableCell>
                                                        <Typography fontWeight={800} color={tx.type === "debit" ? "error.main" : "success.main"}>
                                                            {tx.type === "debit" ? "-" : "+"}${parseFloat(tx.amount).toFixed(2)}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell><Typography variant="body2" color="text.secondary">{refLabels[tx.reference_type] || tx.reference_type}</Typography></TableCell>
                                                    <TableCell><Typography variant="body2">{tx.description || "—"}</Typography></TableCell>
                                                    <TableCell>${parseFloat(tx.balance_before).toFixed(2)}</TableCell>
                                                    <TableCell>${parseFloat(tx.balance_after).toFixed(2)}</TableCell>
                                                    <TableCell>{new Date(tx.created_at).toLocaleString()}</TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                component="div"
                                count={transactions.total}
                                page={page - 1}
                                onPageChange={(_, p) => setPage(p + 1)}
                                rowsPerPage={transactions.per_page}
                                rowsPerPageOptions={[]}
                            />
                        </>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
}
