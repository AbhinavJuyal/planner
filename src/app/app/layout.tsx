import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSideBar from "@/components/app-sidebar";
import AppBreadcrumb from "@/components/app-breadcrumb";

const AppLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <SidebarProvider>
      <AppSideBar />
      <AppBreadcrumb>{children}</AppBreadcrumb>
    </SidebarProvider>
  );
};

export default AppLayout;
