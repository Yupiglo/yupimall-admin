"use client";

import { useEffect, useState } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Box, Typography, Chip, Stack, Avatar } from "@mui/material";

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom delivery personnel icon - matches app's primary color theme
const deliveryPersonSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36">
  <circle cx="12" cy="12" r="11" fill="#1976d2" stroke="#fff" stroke-width="2"/>
  <path d="M12 6c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm0 8c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#fff"/>
</svg>`;

const deliveryIcon = new L.DivIcon({
    html: deliveryPersonSvg,
    className: 'custom-delivery-icon',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
});

// Custom destination icon - uses warning color for visibility
const destinationSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#ed6c02" stroke="#fff" stroke-width="1.5"/>
  <circle cx="12" cy="9" r="3" fill="#fff"/>
</svg>`;

const destinationIcon = new L.DivIcon({
    html: destinationSvg,
    className: 'custom-destination-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

interface DeliveryPerson {
    id: number;
    name: string;
    email: string;
    phone?: string;
    image_url?: string;
    active_deliveries?: number;
    // Mock position data
    latitude?: number;
    longitude?: number;
}

interface ActiveDelivery {
    id: number;
    tracking_code: string;
    shipping_name: string;
    shipping_city: string;
    shipping_street?: string;
    order_status: string;
    delivery_person?: DeliveryPerson;
    // Mock destination coordinates
    dest_latitude?: number;
    dest_longitude?: number;
}

interface DeliveryMapProps {
    personnel: DeliveryPerson[];
    deliveries: ActiveDelivery[];
    onSelectDelivery?: (delivery: ActiveDelivery) => void;
    onSelectPersonnel?: (person: DeliveryPerson) => void;
}

// Component to auto-fit bounds
function FitBounds({ positions }: { positions: [number, number][] }) {
    const map = useMap();

    useEffect(() => {
        if (positions.length > 0) {
            const bounds = L.latLngBounds(positions);
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [map, positions]);

    return null;
}

export default function DeliveryMap({
    personnel,
    deliveries,
    onSelectDelivery,
    onSelectPersonnel,
}: DeliveryMapProps) {
    const [isMounted, setIsMounted] = useState(false);

    // Generate mock positions for demo (Togo region)
    const personnelWithPositions = personnel.map((person, index) => ({
        ...person,
        latitude: person.latitude || 6.1286 + (Math.random() - 0.5) * 0.1,
        longitude: person.longitude || 1.2255 + (Math.random() - 0.5) * 0.1,
    }));

    const deliveriesWithPositions = deliveries.map((delivery, index) => ({
        ...delivery,
        dest_latitude: delivery.dest_latitude || 6.1286 + (Math.random() - 0.5) * 0.15,
        dest_longitude: delivery.dest_longitude || 1.2255 + (Math.random() - 0.5) * 0.15,
    }));

    // Collect all positions for bounds fitting
    const allPositions: [number, number][] = [
        ...personnelWithPositions.map(p => [p.latitude!, p.longitude!] as [number, number]),
        ...deliveriesWithPositions.map(d => [d.dest_latitude!, d.dest_longitude!] as [number, number]),
    ];

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
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
        );
    }

    // Default center: Lomé, Togo
    const defaultCenter: [number, number] = [6.1286, 1.2255];

    return (
        <Box
            sx={{
                height: 400,
                borderRadius: "16px",
                overflow: "hidden",
                border: "1px solid",
                borderColor: "divider",
                "& .leaflet-container": {
                    height: "100%",
                    width: "100%",
                    borderRadius: "16px",
                },
            }}
        >
            <MapContainer
                center={defaultCenter}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {allPositions.length > 0 && <FitBounds positions={allPositions} />}

                {/* Delivery Personnel Markers */}
                {personnelWithPositions.map((person) => (
                    <Marker
                        key={`personnel-${person.id}`}
                        position={[person.latitude!, person.longitude!]}
                        icon={deliveryIcon}
                        eventHandlers={{
                            click: () => onSelectPersonnel?.(person),
                        }}
                    >
                        <Popup>
                            <Stack spacing={1} sx={{ minWidth: 150 }}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Avatar
                                        src={person.image_url}
                                        sx={{ width: 32, height: 32 }}
                                    >
                                        {person.name?.charAt(0)}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="subtitle2" fontWeight="bold">
                                            {person.name}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Delivery Personnel
                                        </Typography>
                                    </Box>
                                </Stack>
                                {person.phone && (
                                    <Typography variant="caption" color="text.secondary">
                                        📞 {person.phone}
                                    </Typography>
                                )}
                                <Chip
                                    label={`${person.active_deliveries || 0} active deliveries`}
                                    size="small"
                                    color={person.active_deliveries ? "primary" : "default"}
                                    sx={{ fontSize: 11 }}
                                />
                            </Stack>
                        </Popup>
                    </Marker>
                ))}

                {/* Delivery Destination Markers */}
                {deliveriesWithPositions.map((delivery) => (
                    <Marker
                        key={`delivery-${delivery.id}`}
                        position={[delivery.dest_latitude!, delivery.dest_longitude!]}
                        icon={destinationIcon}
                        eventHandlers={{
                            click: () => onSelectDelivery?.(delivery),
                        }}
                    >
                        <Popup>
                            <Stack spacing={1} sx={{ minWidth: 180 }}>
                                <Typography variant="subtitle2" fontWeight="bold">
                                    {delivery.tracking_code}
                                </Typography>
                                <Typography variant="body2">
                                    📦 {delivery.shipping_name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    📍 {delivery.shipping_street}, {delivery.shipping_city}
                                </Typography>
                                <Chip
                                    label={delivery.order_status}
                                    size="small"
                                    color={
                                        delivery.order_status === "In Transit"
                                            ? "info"
                                            : delivery.order_status === "Pending"
                                                ? "warning"
                                                : "default"
                                    }
                                    sx={{ fontSize: 11 }}
                                />
                                {delivery.delivery_person && (
                                    <Typography variant="caption">
                                        🚚 Assigned to: {delivery.delivery_person.name}
                                    </Typography>
                                )}
                            </Stack>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </Box>
    );
}
