"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import LogoBig from "@/assets/Logo/LogoBig.png";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Toolbar,
  Divider,
  Tooltip,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Inventory2 as ProductsIcon,
  ShoppingCart as OrdersIcon,
  LocalShipping as DeliveriesIcon,
  Moped as CouriersIcon,
  People as CustomersIcon,
  SupervisorAccount as ManagersIcon,
  Notifications as NotificationsIcon,
  Assignment as LogsIcon,
  Person as ProfileIcon,
  Logout as LogoutIcon,
  ArrowCircleUp as EntriesIconAlt,
  ArrowCircleDown as ExitsIconAlt,
  AccountBalanceWallet as WalletIcon,
} from "@mui/icons-material";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: <DashboardIcon /> },
  { name: "Products", href: "/products", icon: <ProductsIcon /> },
  { name: "Orders", href: "/orders", icon: <OrdersIcon /> },
  { name: "Registrations", href: "/registrations", icon: <LogsIcon /> },
  { name: "Entries", href: "/entries", icon: <ExitsIconAlt /> },
  { name: "Exits", href: "/exits", icon: <EntriesIconAlt /> },
  { name: "Delivery", href: "/delivery", icon: <DeliveriesIcon /> },
  { name: "Customers", href: "/customers", icon: <CustomersIcon /> },
  { name: "Managers", href: "/managers", icon: <ManagersIcon /> },
  { name: "Wallets", href: "/wallets", icon: <WalletIcon /> },
  { name: "Notifications", href: "/notifications", icon: <NotificationsIcon /> },
  { name: "System Logs", href: "/logs", icon: <LogsIcon /> },
  { name: "Profile", href: "/profile", icon: <ProfileIcon /> },
];

const expandedWidth = 256;
const collapsedWidth = 72;

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed?: boolean;
};

export default function Sidebar({ isOpen, onClose, isCollapsed = false }: SidebarProps) {
  const pathname = usePathname();
  const currentWidth = isCollapsed ? collapsedWidth : expandedWidth;

  const drawerContent = (
    <>
      <Toolbar
        sx={{
          height: 80,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          px: isCollapsed ? 1 : 2,
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: isCollapsed ? 40 : 128,
            height: 40,
            transition: "width 200ms ease",
          }}
        >
          <Image
            src={LogoBig}
            alt="YupiFlow"
            fill
            className="object-contain"
            style={{ objectPosition: isCollapsed ? "center" : "center" }}
          />
        </Box>
      </Toolbar>
      <Divider />
      <List sx={{ flex: 1, px: isCollapsed ? 1 : 2, pt: 2 }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const button = (
            <ListItemButton
              component={Link}
              href={item.href}
              selected={isActive}
              sx={{
                borderRadius: "12px",
                justifyContent: isCollapsed ? "center" : "flex-start",
                px: isCollapsed ? 1.5 : 2,
                "&.Mui-selected": {
                  backgroundColor: "rgba(112, 124, 229, 0.1)",
                  color: "#707ce5",
                  "&:hover": {
                    backgroundColor: "rgba(112, 124, 229, 0.2)",
                  },
                  "& .MuiListItemIcon-root": {
                    color: "#707ce5",
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: isCollapsed ? 0 : 40,
                  color: isActive ? "#707ce5" : "text.secondary",
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </ListItemIcon>
              {!isCollapsed && (
                <ListItemText
                  primary={item.name}
                  slotProps={{
                    primary: {
                      fontSize: 14,
                      fontWeight: isActive ? 600 : 500,
                    },
                  }}
                />
              )}
            </ListItemButton>
          );

          return (
            <ListItem key={item.name} disablePadding sx={{ mb: 1 }}>
              {isCollapsed ? (
                <Tooltip title={item.name} placement="right" arrow>
                  {button}
                </Tooltip>
              ) : (
                button
              )}
            </ListItem>
          );
        })}
      </List>
      <Divider />
      <Box sx={{ p: isCollapsed ? 1 : 2 }}>
        {isCollapsed ? (
          <Tooltip title="Sign Out" placement="right" arrow>
            <ListItemButton
              component={Link}
              href="/logout"
              sx={{
                borderRadius: "12px",
                color: "text.secondary",
                justifyContent: "center",
                px: 1.5,
                "&:hover": {
                  backgroundColor: "error.lighter",
                  color: "error.main",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, color: "inherit", justifyContent: "center" }}>
                <LogoutIcon />
              </ListItemIcon>
            </ListItemButton>
          </Tooltip>
        ) : (
          <ListItemButton
            component={Link}
            href="/logout"
            sx={{
              borderRadius: "12px",
              color: "text.secondary",
              "&:hover": {
                backgroundColor: "error.lighter",
                color: "error.main",
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="Sign Out"
              slotProps={{
                primary: { fontSize: 14, fontWeight: 500 },
              }}
            />
          </ListItemButton>
        )}
      </Box>
    </>
  );

  return (
    <Box
      component="nav"
      sx={{
        width: { lg: currentWidth },
        flexShrink: { lg: 0 },
        transition: "width 200ms ease",
      }}
    >
      {/* Mobile Drawer (Temporary) */}
      <Drawer
        variant="temporary"
        open={isOpen}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", lg: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: expandedWidth },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer (Permanent) */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", lg: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: currentWidth,
            borderRight: "1px solid #e5e5e5",
            transition: "width 200ms ease",
            overflowX: "hidden",
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}
