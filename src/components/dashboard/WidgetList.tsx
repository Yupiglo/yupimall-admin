"use client";

import Image, { StaticImageData } from "next/image";
import {
  Card,
  CardHeader,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Box,
  Button,
  Chip,
  Divider,
} from "@mui/material";
import Link from "next/link";
import { Person } from "@mui/icons-material";

export type WidgetItem = {
  id: string | number;
  title: string;
  subtitle: string;
  value?: string;
  image?: string | StaticImageData;
  badge?: string;
  badgeColor?: string;
};

type WidgetListProps = {
  title: string;
  items: WidgetItem[];
  viewAllLink?: string;
};

export default function WidgetList({
  title,
  items,
  viewAllLink,
}: WidgetListProps) {
  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 2,
          py: 2,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          {title}
        </Typography>
        {viewAllLink && (
          <Button component={Link} href={viewAllLink} size="small">
            View All
          </Button>
        )}
      </Box>
      <List sx={{ p: 0, overflow: "auto", flex: 1 }}>
        {items.map((item, index) => (
          <Box key={item.id}>
            <ListItem
              alignItems="center"
              sx={{
                py: 2,
                "&:hover": { bgcolor: "action.hover" },
                transition: "background-color 0.2s",
              }}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: "background.default" }}>
                  {item.image ? (
                    typeof item.image === "string" ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <Image
                        src={item.image}
                        alt={item.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    )
                  ) : (
                    <Person color="action" />
                  )}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="subtitle2" fontWeight="medium" noWrap>
                    {item.title}
                  </Typography>
                }
                secondary={
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    noWrap
                    display="block"
                  >
                    {item.subtitle}
                  </Typography>
                }
                sx={{ mr: 2 }}
              />
              <Box sx={{ textAlign: "right", minWidth: "max-content" }}>
                {item.value && (
                  <Typography variant="body2" fontWeight="semibold">
                    {item.value}
                  </Typography>
                )}
                {item.badge && (
                  <Chip
                    label={item.badge}
                    size="small"
                    color={(item.badgeColor as any) || "default"}
                    variant="outlined" // Optional, or 'filled' (default)
                    sx={{
                      height: 20,
                      fontSize: "0.65rem",
                    }}
                  />
                )}
              </Box>
            </ListItem>
            {index < items.length - 1 && <Divider component="li" />}
          </Box>
        ))}
      </List>
    </Card>
  );
}
