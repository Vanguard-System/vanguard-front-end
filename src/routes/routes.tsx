import { BrowserRouter, Route, Routes } from "react-router-dom";
import BasePage from "@/pages/BasePage";
import Login from "@/pages/LoginPage";
import Home from "@/pages/HomePage";
import DrivePage from "@/pages/DriverPage";
import CarPage from "@/pages/CarPage";
import ClientPage from "@/pages/ClientPage";
import SettingsPage from "@/pages/SettingsPage";
import BudgetPage from "@/pages/BudgetPage";
import PrivateRoute from "@/components/PrivateRoute";
import ForgotPasswordForm from "@/components/ForgotPasswordForm";
import ResetPasswordForm from "@/components/ResetPasswordForm";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        <Route path="/reset-password" element={<ResetPasswordForm />} />
        
        <Route
          path="/"
          element={
            <PrivateRoute>
              <BasePage /> 
            </PrivateRoute>
          }
        >
          <Route index element={<Home />} /> 
          <Route path="Home" element={<Home />} />
          <Route path="Driver" element={<DrivePage />} />
          <Route path="Car" element={<CarPage />} />
          <Route path="Client" element={<ClientPage />} />
          <Route path="Settings" element={<SettingsPage />} />
          <Route path="Budget" element={<BudgetPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
