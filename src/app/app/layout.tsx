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
      <AppBreadcrumb>
        <div className="container h-[calc(100vh_-_64px)] overflow-hidden mx-auto py-10">
          {children}
        </div>
      </AppBreadcrumb>
    </SidebarProvider>
  );
};

export default AppLayout;
