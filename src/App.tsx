import { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SearchOverlay from './components/SearchOverlay';
import ProductModal from './components/ProductModal';
import AddedToBagDrawer from './components/AddedToBagDrawer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import OurStory from './pages/OurStory';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import OrderConfirmation from './pages/OrderConfirmation';
import SplashLanding from './components/SplashLanding';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import ReturnPolicy from './pages/ReturnPolicy';
import ShippingPolicy from './pages/ShippingPolicy';
import SizeGuide from './pages/SizeGuide';
import WishlistPage from './pages/Wishlist';
import WhatsAppButton from './components/WhatsAppButton';
import { WishlistProvider } from './context/WishlistContext';
import type { Product } from './data/products';

import { trackPageView } from './lib/analytics';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    trackPageView(pathname);
  }, [pathname]);
  return null;
}

function Layout() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [addedProduct, setAddedProduct] = useState<Product | null>(null);
  const location = useLocation();

  const isCheckoutFlow =
    location.pathname === '/order-confirmation';

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
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/return-policy" element={<ReturnPolicy />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/size-guide" element={<SizeGuide />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      {!isCheckoutFlow && <Footer />}
      {!isCheckoutFlow && <WhatsAppButton phoneNumber="919999999999" />}

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
        onAddedToCart={(prod) => setAddedProduct(prod)}
      />

      {/* Global Added To Bag Luxury Slide-Over Drawer */}
      <AddedToBagDrawer
        product={addedProduct}
        onClose={() => setAddedProduct(null)}
      />
    </div>
  );
}

import { CurrencyProvider } from './context/CurrencyContext';

export default function App() {
  return (
    <BrowserRouter>
      <CurrencyProvider>
        <WishlistProvider>
          <CartProvider>
            <ScrollToTop />
            <Layout />
          </CartProvider>
        </WishlistProvider>
      </CurrencyProvider>
    </BrowserRouter>
  );
}
