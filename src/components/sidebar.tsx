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
  SidebarTrigger,
} from "./ui/sidebar";
import { ModeToggle } from "./mode-toggle";

const navigationItems = [
  {
    title: "My Day",
    link: "/my-day",
    icon: <Sun color="currentColor" />,
  },
  {
    title: "My Tasks",
    link: "/my-tasks",
    icon: <BookOpenCheck color="currentColor" />,
  },
  {
    title: "My Plans",
    link: "/my-plans",
    icon: <LayoutDashboard color="currentColor" />,
  },
];

const AppSideBar = () => {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center">
          <SidebarTrigger />
          <ModeToggle />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map(({ title, link, icon }) => {
                return (
                  <SidebarMenuItem key={title}>
                    <SidebarMenuButton asChild className="h-12">
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
