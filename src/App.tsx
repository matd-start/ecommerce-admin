
// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* Futuras rutas: detalle de producto, perfil de usuario, etc. */}
      </Routes>
    </Layout>
  );
}

export default App;