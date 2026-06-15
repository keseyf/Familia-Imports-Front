import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AdminPage from "./pages/admin/admin";
import NotFound from "./pages/NotFound";
import AdminPedidos from "./pages/admin/AdminPedidos";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/pedidos" element={<AdminPedidos />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;