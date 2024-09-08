import React, {useContext} from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Products from './pages/Products';
import theme from './styles/theme';
import { AuthProvider } from './context/AuthContext';
import { AuthContext } from './context/AuthContext';
import PageContent from './components/PageContent';
import ConfirmOrder from "./pages/ConfirmOrder";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <PageContent>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<SinAutenticar/>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/order" element={<ConfirmOrder />} />
          </Routes>
        </Router>
      </AuthProvider>
      </PageContent>
    </ThemeProvider>
  );
};

// Componente de ruta protegida para redirigir al login si no hay usuario autenticado
const SinAutenticar = () => {
  const { auth } = useContext(AuthContext);

  if (!auth.user) {
    // Redirige al login si no hay usuario autenticado
    return <Navigate to="/login" />;
  }

  return <Home />;
};

export default App;
