import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";
import RootLayout from "./components/RootLayout";
import Servants from "./pages/servants/Servants";
import Tables from "./pages/tables/Tables";
import Products from "./pages/products/Products";
import AddProduct from "./pages/products/AddProduct";
import EditProduct from "./pages/products/EditProduct";
import Orders from "./pages/orders/Orders";
import NewOrder from "./pages/orders/NewOrder";
import ViewOrder from "./pages/orders/ViewOrder";
import Login from "./pages/login/Login";
function App() {
  return (
    <BrowserRouter>
      <RootLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/add" element={<NewOrder />} />
          <Route path="/orders/:id" element={<ViewOrder />} />
          <Route path="/servants" element={<Servants />} />
          <Route path="/tables" element={<Tables />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/add" element={<AddProduct />} />
          <Route path="/products/:id/edit" element={<EditProduct />} />
        </Routes>
      </RootLayout>
    </BrowserRouter>
  );
}

export default App;
