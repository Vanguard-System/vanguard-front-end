import { BrowserRouter, Route, Routes } from "react-router-dom";
import BasePage from "@/pages/BasePage";
import Login from "@/components/login";
import Home from "@/pages/HomePage";


export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} /> {/* <- rota direta */}

        <Route path="/" element={<BasePage />}>
        <Route path="/Home" element={<Home />}/>

          
          {/* outras rotas aninhadas aqui */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
