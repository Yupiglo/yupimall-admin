"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
  IconButton,
  Button,
  Avatar,
  Chip,
  Divider,
  Grid,
} from "@mui/material";
import {
  ArrowBack as BackIcon,
  Edit as EditIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  ShoppingBag as OrdersIcon,
  MonetizationOn as SpentIcon,
  AccessTime as LastOrderIcon,
} from "@mui/icons-material";

const customers = [
  {
    id: "#CUS-501",
    name: "Alice Johnson",
    email: "alice.j@example.com",
    phone: "+1 555-0101",
    totalOrders: 12,
    totalSpent: "$1,450.00",
    lastOrder: "Oct 26, 2025",
  },
];

export default function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const decodedId = decodeURIComponent(id);

  // Mock finding customer by ID
  const customer = customers.find((c) => c.id === decodedId) || customers[0];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <IconButton
          onClick={() => router.push("/customers")}
          sx={{
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: "12px",
          }}
        >
          <BackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" fontWeight="bold" color="primary.main">
            Customer Profile
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Viewing customer activity and contact details.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() =>
            router.push(`/customers/${encodeURIComponent(decodedId)}/edit`)
          }
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: "bold",
            px: 3,
            boxShadow: "none",
          }}
        >
          Edit Customer
        </Button>
      </Stack>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={3}>
            <Card
              elevation={0}
              sx={{
                borderRadius: "20px",
                border: "1px solid",
                borderColor: "divider",
                textAlign: "center",
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    mx: "auto",
                    mb: 2,
                    bgcolor: "secondary.light",
                    color: "secondary.main",
                    fontSize: "3rem",
                    fontWeight: "bold",
                    border: "4px solid",
                    borderColor: "background.paper",
                  }}
                >
                  {customer.name.charAt(0)}
                </Avatar>
                <Typography variant="h5" fontWeight="bold">
                  {customer.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {customer.id}
                </Typography>
                <Chip
                  label="Loyal Customer"
                  color="secondary"
                  size="small"
                  sx={{ mt: 2, fontWeight: "bold", borderRadius: "6px" }}
                />
              </CardContent>
            </Card>

            <Card
              elevation={0}
              sx={{
                borderRadius: "20px",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  sx={{ mb: 2 }}
                >
                  Contact Information
                </Typography>
                <Stack spacing={2.5}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <EmailIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        Email
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {customer.email}
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <PhoneIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        Phone
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {customer.phone}
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Grid container spacing={3}>
            {[
              {
                label: "Total Orders",
                value: customer.totalOrders,
                icon: <OrdersIcon />,
                color: "primary.main",
              },
              {
                label: "Total Spent",
                value: customer.totalSpent,
                icon: <SpentIcon />,
                color: "success.main",
              },
              {
                label: "Last Order",
                value: customer.lastOrder,
                icon: <LastOrderIcon />,
                color: "warning.main",
              },
            ].map((stat, idx) => (
              <Grid key={idx} size={{ xs: 12, sm: 4 }}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: "16px",
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.paper",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box sx={{ color: stat.color, display: "flex" }}>
                        {stat.icon}
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          {stat.label}
                        </Typography>
                        <Typography variant="h6" fontWeight="bold">
                          {stat.value}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}

            <Grid size={{ xs: 12 }}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: "20px",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Order History
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                  >
                    Recent transactions and order statuses.
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  <Box
                    sx={{
                      textAlign: "center",
                      py: 4,
                      bgcolor: "background.default",
                      borderRadius: "12px",
                      border: "1px dashed",
                      borderColor: "divider",
                    }}
                  >
                    <Typography color="text.disabled">
                      No recent orders to display for this mock.
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
