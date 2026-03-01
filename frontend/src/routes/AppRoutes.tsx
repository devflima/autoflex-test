import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductPage from "../features/products/ProductPage";
import MaterialPage from "../features/materials/MaterialPage";
import ProductionSuggestionPage from "../features/production/ProductionSuggestionPage";
import AppLayout from "../components/layout/Layout";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<ProductionSuggestionPage />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/materials" element={<MaterialPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}