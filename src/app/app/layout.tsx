import React from "react";
import AppSideBar from "@/components/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const AppLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <SidebarProvider>
      <AppSideBar />
      {children}
    </SidebarProvider>
  );
};

export default AppLayout;
