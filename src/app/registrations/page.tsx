"use client";

import { Box, Stack } from "@mui/material";
import RegistrationsHeader from "../../components/registrations/RegistrationsHeader";
import RegistrationsTable from "../../components/registrations/RegistrationsTable";
import { useState } from "react";

export default function RegistrationsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const handleRefresh = () => {
        setRefreshTrigger((prev) => prev + 1);
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Stack spacing={4}>
                <RegistrationsHeader onSearch={handleSearch} onRefresh={handleRefresh} />
                <RegistrationsTable searchQuery={searchQuery} refreshTrigger={refreshTrigger} />
            </Stack>
        </Box>
    );
}
