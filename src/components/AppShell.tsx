"use client";

import { Box } from "@mui/material";
import { useState, createContext, useContext } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

// Context for sidebar collapse state
interface SidebarContextType {
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

export const SidebarContext = createContext<SidebarContextType>({
  isCollapsed: false,
  toggleCollapse: () => { },
});

export const useSidebar = () => useContext(SidebarContext);

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  // Drawer widths
  const expandedWidth = 256;
  const collapsedWidth = 72;
  const currentWidth = isCollapsed ? collapsedWidth : expandedWidth;

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleCollapse }}>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          isCollapsed={isCollapsed}
        />
        <Header
          onMenuClick={() => setIsSidebarOpen(true)}
          onToggleCollapse={toggleCollapse}
          isCollapsed={isCollapsed}
        />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            ml: { lg: `${currentWidth}px` },
            transition: "margin 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
          }}
        >
          {children}
        </Box>
      </Box>
    </SidebarContext.Provider>
  );
}
