import { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SearchOverlay from './components/SearchOverlay';
import ProductModal from './components/ProductModal';
import AddedToCartToast from './components/AddedToCartToast';
import Home from './pages/Home';
import Shop from './pages/Shop';
import OurStory from './pages/OurStory';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import SplashLanding from './components/SplashLanding';
import type { Product } from './data/products';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

function Layout() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [toastName, setToastName] = useState<string | null>(null);
  const location = useLocation();

  const isCheckoutFlow =
    location.pathname === '/checkout' || location.pathname === '/order-confirmation';

  return (
    <div className="flex flex-col min-h-screen">
      {location.pathname === '/' && <SplashLanding />}
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/our-story" element={<OurStory />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      {!isCheckoutFlow && <Footer />}

      {/* Global Search Overlay */}
      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectProduct={(product) => {
          setSelectedProduct(product);
          setSearchOpen(false);
        }}
      />

      {/* Global Product Modal (from search) */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddedToCart={(name) => setToastName(name)}
      />

      {/* Global Toast */}
      <AddedToCartToast productName={toastName} onClose={() => setToastName(null)} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <ScrollToTop />
        <Layout />
      </CartProvider>
    </BrowserRouter>
  );
}
