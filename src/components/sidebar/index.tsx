"use client"

import { Home, FileText, User, Car } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"

const menuItems = [
  {
    title: "Home",
    icon: Home,
    url: "/Home",
  },
  {
    title: "Orçamentos",
    icon: FileText,
    url: "/Orcamentos",
  },
  {
    title: "Motorista",
    icon: User,
    url: "/Motorista",
  },
  {
    title: "Carro",
    icon: Car,
    url: "/Carro",
  },
]

export default function SidebarApp() {
  return (
    <SidebarProvider>
      <Sidebar className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 border-r border-gray-200">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  )
}
