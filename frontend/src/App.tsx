import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/layout/Navbar'
import CartDrawer from './components/layout/CartDrawer'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import Checkout from './pages/Checkout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminProductForm from './pages/admin/AdminProductForm'
import AdminOrders from './pages/admin/AdminOrders'

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1A1A1A',
            color: '#F5F4F0',
            border: '1px solid rgba(255,255,255,0.1)',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '13px',
            letterSpacing: '0.05em',
          },
          success: { iconTheme: { primary: '#FF3B00', secondary: '#F5F4F0' } },
        }}
      />
      <Routes>
        {/* Admin — sem Navbar/Footer */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/produtos" element={<AdminProducts />} />
        <Route path="/admin/produtos/novo" element={<AdminProductForm />} />
        <Route path="/admin/produtos/editar/:id" element={<AdminProductForm />} />
        <Route path="/admin/pedidos" element={<AdminOrders />} />

        {/* Public — com layout */}
        <Route path="/*" element={
          <>
            <Navbar />
            <CartDrawer />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:slug" element={<ProductDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/checkout" element={<Checkout />} />
            </Routes>
            <Footer />
          </>
        } />
      </Routes>
    </BrowserRouter>
  )
}
