"use client";

import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Badge,
  Typography,
  Avatar,
  Stack,
  useTheme,
  Menu,
  MenuItem,
  Divider,
  Button,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
  LockOutlined as LockIcon,
  KeyboardDoubleArrowLeft as CollapseIcon,
  KeyboardDoubleArrowRight as ExpandIcon,
} from "@mui/icons-material";
import { useColorMode } from "./ThemeRegistry/ColorModeContext";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axiosInstance from "@/lib/axios";

interface NotificationEntry {
  id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

type HeaderProps = {
  onMenuClick: () => void;
  onToggleCollapse?: () => void;
  isCollapsed?: boolean;
};

export default function Header({ onMenuClick, onToggleCollapse, isCollapsed = false }: HeaderProps) {
  const { data: session } = useSession();
  const user = session?.user;

  const theme = useTheme();
  const colorMode = useColorMode();
  const [notificationsAnchor, setNotificationsAnchor] =
    useState<null | HTMLElement>(null);

  const [notifications, setNotifications] = useState<NotificationEntry[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const response = await axiosInstance.get("notifications");
      const list = response.data.notifications.data || [];
      setNotifications(list.slice(0, 5)); // Show only last 5 in dropdown
      setUnreadCount(list.filter((n: any) => !n.is_read).length);
    } catch (err) {
      console.error("Failed to fetch notifications in Header:", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      // Poll every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleOpenNotifications = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleCloseNotifications = () => {
    setNotificationsAnchor(null);
  };

  const open = Boolean(notificationsAnchor);

  const formatTimeHeader = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMins = Math.floor((now.getTime() - date.getTime()) / 60000);
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
        color: "text.primary",
      }}
    >
      <Toolbar sx={{ ml: { lg: isCollapsed ? "72px" : "256px" }, transition: "margin 200ms ease" }}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { lg: "none" } }}
        >
          <MenuIcon />
        </IconButton>

        <IconButton
          color="inherit"
          aria-label="toggle sidebar"
          onClick={onToggleCollapse}
          sx={{
            display: { xs: "none", lg: "flex" },
            mr: 1,
            color: "text.secondary",
            "&:hover": { color: "primary.main" },
          }}
        >
          {isCollapsed ? <ExpandIcon /> : <CollapseIcon />}
        </IconButton>

        <Stack
          direction="row"
          spacing={0.5}
          alignItems="center"
          sx={{
            display: { xs: "none", sm: "flex" },
            ml: { lg: 2 },
            flexShrink: 0,
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
            Home
          </Typography>
          <Typography variant="body2" color="text.disabled">{">"}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
            Store
          </Typography>
          <Typography variant="body2" color="text.disabled">{">"}</Typography>
          <Typography variant="body2" color="text.primary" fontWeight="medium" sx={{ whiteSpace: "nowrap" }}>
            YupiMall
          </Typography>
          <Typography variant="body2" color="text.disabled">{">"}</Typography>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <LockIcon sx={{ fontSize: 14, color: "text.secondary" }} />
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
              {(user as any)?.role === 'dev' ? 'Developer' : (user as any)?.role === 'webmaster' ? 'Webmaster' : 'Admin'} Area
            </Typography>
          </Stack>
        </Stack>

        <Box sx={{ flexGrow: 1 }} />

        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton
            sx={{ ml: 1 }}
            onClick={colorMode.toggleColorMode}
            color="inherit"
          >
            {theme.palette.mode === "dark" ? (
              <Brightness7Icon />
            ) : (
              <Brightness4Icon />
            )}
          </IconButton>

          <IconButton
            size="large"
            color="inherit"
            onClick={handleOpenNotifications}
            sx={{
              backgroundColor: open ? "action.hover" : "transparent",
            }}
          >
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <Menu
            anchorEl={notificationsAnchor}
            open={open}
            onClose={handleCloseNotifications}
            onClick={handleCloseNotifications}
            PaperProps={{
              elevation: 0,
              sx: {
                width: 320,
                maxHeight: 480,
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.1))",
                mt: 1.5,
                borderRadius: "16px",
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <Box sx={{ p: 2, pb: 1 }}>
              <Typography variant="h6" fontWeight="bold">
                Notifications
              </Typography>
            </Box>
            <Divider />
            <Box sx={{ maxHeight: 320, overflowY: "auto" }}>
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <MenuItem
                    key={notification.id}
                    onClick={handleCloseNotifications}
                    sx={{
                      py: 1.5,
                      px: 2,
                      borderBottom: "1px solid",
                      borderColor: "divider",
                      "&:last-child": { borderBottom: 0 },
                      whiteSpace: "normal",
                      display: "block",
                      ...(!notification.is_read && {
                        bgcolor: "action.hover",
                      }),
                    }}
                  >
                    <Stack spacing={0.5}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="subtitle2" fontWeight="bold">
                          {notification.title}
                        </Typography>
                        {!notification.is_read && (
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              bgcolor: "primary.main",
                            }}
                          />
                        )}
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {notification.message}
                      </Typography>
                      <Typography variant="caption" color="text.disabled">
                        {formatTimeHeader(notification.created_at)}
                      </Typography>
                    </Stack>
                  </MenuItem>
                ))
              ) : (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    No new notifications
                  </Typography>
                </Box>
              )}
            </Box>
            <Divider />
            <Box sx={{ p: 1, textAlign: "center" }}>
              <Button
                component={Link}
                href="/notifications"
                fullWidth
                sx={{
                  textTransform: "none",
                  fontWeight: "bold",
                  borderRadius: "10px",
                }}
              >
                View All
              </Button>
            </Box>
          </Menu>

          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{ ml: 1, cursor: "pointer" }}
            component={Link}
            href="/profile"
          >
            <Avatar
              sx={{
                bgcolor: "primary.main",
                width: 40,
                height: 40,
                fontSize: "1rem",
                fontWeight: "bold",
              }}
              src={user?.image || undefined}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Typography variant="subtitle2" component="div">
                {user?.name || "User"}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                {(user as any)?.role || "Member"}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
