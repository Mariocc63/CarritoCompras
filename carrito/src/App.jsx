import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import theme from "./styles/theme";
import { AuthProvider } from "./context/AuthContext";
import { AuthContext } from "./context/AuthContext";
import PageContent from "./components/PageContent";
import ConfirmOrder from "./pages/ConfirmOrder";
import OrderHistory from "./pages/OrderHistory";
import ConfirmedOrders from "./pages/ConfirmedOrders";
import OrderDetails from "./pages/OrderDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import AccessDenied from "./pages/AccessDenied";
import ViewCategories from "./pages/ViewCategories";
import EditCategory from "./pages/EditCategory";
import AddCategory from "./pages/AddCategory";
import ViewProducts from "./pages/ViewProducts";
import EditProduct from "./pages/EditProduct";
import AddProduct from "./pages/AddProduct";
import Cart from "./pages/Cart";

const ROLES = {
  OPERADOR_ADMINISTRATIVO: 1,
  CLIENTE: 2,
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <PageContent>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<SinAutenticar />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/products"
                element={
                  <ProtectedRoute requiredRole={ROLES.CLIENTE}>
                    <Products />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cart"
                element={
                  <ProtectedRoute requiredRole={ROLES.CLIENTE}>
                    <Cart />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/order"
                element={
                  <ProtectedRoute requiredRole={ROLES.CLIENTE}>
                    <ConfirmOrder />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/historial"
                element={
                  <ProtectedRoute requiredRole={ROLES.CLIENTE}>
                    <OrderHistory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/confirmed-orders"
                element={
                  <ProtectedRoute requiredRole={ROLES.OPERADOR_ADMINISTRATIVO}>
                    <ConfirmedOrders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/order-details/:idorden"
                element={
                  <ProtectedRoute requiredRole={ROLES.OPERADOR_ADMINISTRATIVO}>
                    <OrderDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/viewcategories"
                element={
                  <ProtectedRoute requiredRole={ROLES.OPERADOR_ADMINISTRATIVO}>
                    <ViewCategories />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit-category/:idcategoria"
                element={
                  <ProtectedRoute requiredRole={ROLES.OPERADOR_ADMINISTRATIVO}>
                    <EditCategory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/addcategory"
                element={
                  <ProtectedRoute requiredRole={ROLES.OPERADOR_ADMINISTRATIVO}>
                    <AddCategory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/viewproducts"
                element={
                  <ProtectedRoute requiredRole={ROLES.OPERADOR_ADMINISTRATIVO}>
                    <ViewProducts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit-product/:idproductos"
                element={
                  <ProtectedRoute requiredRole={ROLES.OPERADOR_ADMINISTRATIVO}>
                    <EditProduct />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/addproduct"
                element={
                  <ProtectedRoute requiredRole={ROLES.OPERADOR_ADMINISTRATIVO}>
                    <AddProduct />
                  </ProtectedRoute>
                }
              />
              <Route path="/access-denied" element={<AccessDenied />} />
            </Routes>
          </Router>
        </AuthProvider>
      </PageContent>
    </ThemeProvider>
  );
};

const SinAutenticar = () => {
  const { auth } = useContext(AuthContext);

  return <Login />;
};

export default App;
