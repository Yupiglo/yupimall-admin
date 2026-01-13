"use client";

import { useState, useEffect, Suspense, lazy } from "react";
import { Box, Stack, Typography } from "@mui/material";
import DeliveryHeader from "@/components/delivery/DeliveryHeader";
import DeliveryTable from "@/components/delivery/DeliveryTable";
import DeliveryPersonnelTable from "@/components/delivery/DeliveryPersonnelTable";
import axios from "@/lib/axios";

// Lazy load the map to avoid SSR issues with Leaflet
const DeliveryMap = lazy(() => import("@/components/delivery/DeliveryMap"));

interface DeliveryPerson {
    id: number;
    name: string;
    email: string;
    phone?: string;
    image_url?: string;
    active_deliveries?: number;
}

interface Delivery {
    id: number;
    tracking_code: string;
    shipping_name: string;
    shipping_city: string;
    shipping_street?: string;
    order_status: string;
    delivery_person?: DeliveryPerson;
}

export default function DeliveryPage() {
    const [view, setView] = useState<"personnel" | "deliveries">("deliveries");
    const [searchQuery, setSearchQuery] = useState("");
    const [personnel, setPersonnel] = useState<DeliveryPerson[]>([]);
    const [deliveries, setDeliveries] = useState<Delivery[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMapData();
    }, []);

    const fetchMapData = async () => {
        try {
            const [personnelRes, deliveriesRes] = await Promise.all([
                axios.get("/delivery/personnel"),
                axios.get("/delivery/active"),
            ]);
            setPersonnel(personnelRes.data.personnel || []);
            setDeliveries(deliveriesRes.data.deliveries || []);
        } catch (error) {
            console.error("Failed to fetch map data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewChange = (newView: "personnel" | "deliveries") => {
        setView(newView);
        setSearchQuery(""); // Reset search when switching views
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Stack spacing={4}>
                <DeliveryHeader
                    view={view}
                    onViewChange={handleViewChange}
                    onSearch={setSearchQuery}
                />

                {/* Interactive Map */}
                <Box>
                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ mb: 2, color: "text.primary" }}
                    >
                        📍 Live Tracking Map
                    </Typography>
                    <Suspense
                        fallback={
                            <Box
                                sx={{
                                    height: 400,
                                    borderRadius: "16px",
                                    bgcolor: "background.paper",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    border: "1px solid",
                                    borderColor: "divider",
                                }}
                            >
                                <Typography color="text.secondary">Loading map...</Typography>
                            </Box>
                        }
                    >
                        {!loading && (
                            <DeliveryMap
                                personnel={personnel}
                                deliveries={deliveries}
                                onSelectPersonnel={(person) => {
                                    console.log("Selected personnel:", person);
                                }}
                                onSelectDelivery={(delivery) => {
                                    console.log("Selected delivery:", delivery);
                                }}
                            />
                        )}
                    </Suspense>
                </Box>

                {/* Data Table based on view */}
                <Box>
                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ mb: 2, color: "text.primary" }}
                    >
                        {view === "deliveries" ? "🚚 Active Deliveries" : "👥 Delivery Personnel"}
                    </Typography>
                    {view === "deliveries" ? (
                        <DeliveryTable searchQuery={searchQuery} />
                    ) : (
                        <DeliveryPersonnelTable searchQuery={searchQuery} />
                    )}
                </Box>
            </Stack>
        </Box>
    );
}
