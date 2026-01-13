"use client";

import { Box, Stack } from "@mui/material";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileDetails from "@/components/profile/ProfileDetails";

export default function ProfilePage() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Stack spacing={4}>
        <ProfileHeader />
        <ProfileDetails />
      </Stack>
    </Box>
  );
}
