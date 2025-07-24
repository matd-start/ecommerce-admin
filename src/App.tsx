import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout'; 
import HomePage from './pages/HomePage'; 
import ProductsPage from './pages/ProductsPage'; 
import CartPage from './pages/CartPage'; 
import LoginPage from './pages/LoginPage'; 
import ProductDetailPage from './pages/ProductDetailPage'; 

// PÁGINAS NECESARIAS PARA EL FLUJO RF5 Y AUTENTICACIÓN
import CheckoutPage from './pages/CheckoutPage'; 
import OrderConfirmationPage from './pages/OrderConfirmationPage'; 
import ProfilePage from './pages/ProfilePage'; 
import NotFoundPage from './pages/NotFoundPage'; 

import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminProductListPage from './pages/AdminProductListPage';
import ProductFormPage from './pages/ProductFormPage';
import AdminUserManagementPage from './pages/AdminUserManagementPage';
import AdminReportsPage from './pages/AdminReportsPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        
        {/* Rutas de autenticación */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} /> {/* Necesaria para ver los detalles del usuario */}
        {/* Rutas para el flujo de compra (RF5) */}
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
        {/* Ruta para el Panel de Administración (RF1) */}
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/products" element={<AdminProductListPage />} />
        <Route path="/admin/products/new" element={<ProductFormPage />} />
        <Route path="/admin/products/edit/:id" element={<ProductFormPage />} />

        <Route path="/admin/users" element={<AdminUserManagementPage />} />
        <Route path="/admin/reports" element={<AdminReportsPage />} />
        
        {/* Ruta  404 - al final de todas las rutas */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
}

export default App;