import Header from "@/components/header";
import SidebarApp from "@/components/sidebar";
import { Outlet } from "react-router-dom";


export default function BasePage() {

  console.log('fui pra prod')

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