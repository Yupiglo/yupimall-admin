"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    IconButton,
    Typography,
    Box,
    Stack,
    Tooltip,
    CircularProgress,
    Avatar,
    Select,
    MenuItem,
    FormControl,
} from "@mui/material";
import {
    Visibility as ViewIcon,
    Person as PersonIcon,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";

interface DeliveryPerson {
    id: number;
    name: string;
    email: string;
    image_url?: string;
}

interface Delivery {
    id: number;
    tracking_code: string;
    shipping_name: string;
    shipping_city: string;
    shipping_street?: string;
    order_status: string;
    created_at: string;
    delivery_person?: DeliveryPerson;
    delivery_person_id?: number;
}

interface DeliveryTableProps {
    searchQuery?: string;
    onSelectDelivery?: (delivery: Delivery) => void;
}

export default function DeliveryTable({
    searchQuery = "",
    onSelectDelivery,
}: DeliveryTableProps) {
    const router = useRouter();
    const [deliveries, setDeliveries] = useState<Delivery[]>([]);
    const [personnel, setPersonnel] = useState<DeliveryPerson[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, [searchQuery]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [deliveriesRes, personnelRes] = await Promise.all([
                axios.get("/delivery/active", {
                    params: { search: searchQuery || undefined },
                }),
                axios.get("/delivery/personnel"),
            ]);
            setDeliveries(deliveriesRes.data.deliveries || []);
            setPersonnel(personnelRes.data.personnel || []);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch deliveries:", err);
            setError("Failed to load active deliveries");
        } finally {
            setLoading(false);
        }
    };

    const handleAssignDeliveryPerson = async (
        orderId: number,
        deliveryPersonId: number | null
    ) => {
        try {
            await axios.post(`/delivery/assign/${orderId}`, {
                delivery_person_id: deliveryPersonId,
            });
            fetchData(); // Refresh the list
        } catch (err) {
            console.error("Failed to assign delivery person:", err);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Delivered":
                return "success";
            case "In Transit":
                return "info";
            case "Processing":
                return "primary";
            case "Pending":
                return "warning";
            case "Cancelled":
                return "error";
            default:
                return "default";
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ textAlign: "center", py: 6 }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    if (deliveries.length === 0) {
        return (
            <Box sx={{ textAlign: "center", py: 6 }}>
                <Typography color="text.secondary">
                    No active deliveries found.
                    {searchQuery && " Try adjusting your search."}
                </Typography>
            </Box>
        );
    }

    return (
        <TableContainer
            component={Paper}
            elevation={0}
            sx={{ borderRadius: "16px", border: "1px solid", borderColor: "divider" }}
        >
            <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ bgcolor: "background.default" }}>
                    <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>Tracking Code</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Customer</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Destination</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Assigned To</TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                            Actions
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {deliveries.map((delivery) => (
                        <TableRow
                            key={delivery.id}
                            hover
                            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                        >
                            <TableCell>
                                <Typography variant="subtitle2" fontWeight="bold">
                                    {delivery.tracking_code}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="body2">{delivery.shipping_name}</Typography>
                            </TableCell>
                            <TableCell>
                                <Box>
                                    <Typography variant="body2" fontWeight="medium">
                                        {delivery.shipping_city}
                                    </Typography>
                                    {delivery.shipping_street && (
                                        <Typography variant="caption" color="text.secondary">
                                            {delivery.shipping_street}
                                        </Typography>
                                    )}
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Chip
                                    label={delivery.order_status}
                                    color={getStatusColor(delivery.order_status) as any}
                                    size="small"
                                    variant="outlined"
                                    sx={{ fontWeight: 500, borderRadius: "100px", px: 0.5 }}
                                />
                            </TableCell>
                            <TableCell>
                                <FormControl size="small" sx={{ minWidth: 150 }}>
                                    <Select
                                        value={delivery.delivery_person_id || ""}
                                        displayEmpty
                                        onChange={(e) =>
                                            handleAssignDeliveryPerson(
                                                delivery.id,
                                                e.target.value as number | null
                                            )
                                        }
                                        sx={{ borderRadius: "8px", fontSize: 13 }}
                                        renderValue={(selected) => {
                                            if (!selected) {
                                                return (
                                                    <Typography variant="body2" color="text.secondary">
                                                        Unassigned
                                                    </Typography>
                                                );
                                            }
                                            const person = personnel.find((p) => p.id === selected);
                                            return (
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Avatar
                                                        src={person?.image_url}
                                                        sx={{ width: 20, height: 20 }}
                                                    >
                                                        {person?.name?.charAt(0)}
                                                    </Avatar>
                                                    <Typography variant="body2">{person?.name}</Typography>
                                                </Stack>
                                            );
                                        }}
                                    >
                                        <MenuItem value="">
                                            <em>Unassigned</em>
                                        </MenuItem>
                                        {personnel.map((person) => (
                                            <MenuItem key={person.id} value={person.id}>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Avatar
                                                        src={person.image_url}
                                                        sx={{ width: 24, height: 24 }}
                                                    >
                                                        {person.name?.charAt(0)}
                                                    </Avatar>
                                                    <Typography variant="body2">{person.name}</Typography>
                                                </Stack>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </TableCell>
                            <TableCell align="right">
                                <Stack direction="row" spacing={1} justifyContent="flex-end">
                                    <Tooltip title="View Order Details">
                                        <IconButton
                                            size="small"
                                            onClick={() => router.push(`/orders/${delivery.id}`)}
                                        >
                                            <ViewIcon fontSize="small" color="action" />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
