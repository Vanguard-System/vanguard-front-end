import { BrowserRouter, Route, Routes } from "react-router-dom";
import BasePage from "@/pages/BasePage";
import Login from "@/pages/LoginPage";
import Home from "@/pages/HomePage";
import DrivePage from "@/pages/DriverPage";
// import BudgetPage from "@/pages/BudgetPage";


export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} /> 

        <Route path="/" element={<BasePage />}>
        <Route path="/Home" element={<Home />} />
        <Route path="/Driver" element={<DrivePage />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}
