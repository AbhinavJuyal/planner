"use client";

import { BookOpenCheck, LayoutDashboard, Sun } from "lucide-react";
import Link from "next/link";
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "./ui/sidebar";
import { usePathname } from "next/navigation";

const navigationItems = [
  {
    title: "My Day",
    link: "/app/my-day",
    icon: <Sun color="currentColor" />,
  },
  {
    title: "My Tasks",
    link: "/app/my-tasks",
    icon: <BookOpenCheck color="currentColor" />,
  },
  {
    title: "My Plans",
    link: "/app/my-plans",
    icon: <LayoutDashboard color="currentColor" />,
  },
];

const AppSideBar = () => {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="text-2xl pl-2 py-4">Planner</div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map(({ title, link, icon }) => {
                const isActive = link === pathname;
                return (
                  <SidebarMenuItem key={title}>
                    <SidebarMenuButton
                      asChild
                      className="h-12"
                      isActive={isActive}
                    >
                      <Link key={title} href={link}>
                        <div className="w-full flex items-center gap-4">
                          <span>{icon}</span>
                          <span>{title}</span>
                        </div>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
};

export default AppSideBar;
