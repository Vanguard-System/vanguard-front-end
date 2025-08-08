import Header from "@/components/header";
import SidebarApp from "@/components/sidebar";
import { Outlet } from "react-router-dom";


export default function BasePage() {
  return (
    <main>
      <Header/>
      <SidebarApp /> 
      <div>
        <Outlet />
      </div>
    </main>
  )
}