"use client";

import {
  Avatar,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

type CardStatsProps = {
  title?: string;
  value?: string;
  change?: string;
  icon?: React.ReactNode;
  color?: string;
  bgColor?: string;
};

export default function CardStats({
  title,
  bgColor,
  color,
  icon,
  value,
  change,
}: CardStatsProps) {
  return (
    <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
      <Card>
        <CardContent>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            sx={{ mb: 2 }}
          >
            <Typography
              variant="subtitle2"
              color="text.secondary"
              fontWeight="medium"
            >
              {title}
            </Typography>
            <Avatar
              sx={{
                bgcolor: bgColor,
                color: color,
                width: 40,
                height: 40,
              }}
            >
              {icon}
            </Avatar>
          </Stack>
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 0.5 }}>
            {value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {change}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}
