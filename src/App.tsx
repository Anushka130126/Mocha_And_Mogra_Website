import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import { CurrencyProvider, WishlistProvider, CartProvider } from './context';
import {
  Navbar,
  Footer,
  SearchOverlay,
  ProductModal,
  AddedToBagDrawer,
  SplashLanding,
  WhatsAppButton,
} from './components';
import {
  Home,
  Shop,
  OurStory,
  Contact,
  Cart,
  OrderConfirmation,
  Privacy,
  Terms,
  ReturnPolicy,
  ShippingPolicy,
  SizeGuide,
  WishlistPage,
} from './pages';

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

  const isOrderConfirmation = location.pathname === '/order-confirmation';

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
      {!isOrderConfirmation && <Footer />}
      {!isOrderConfirmation && <WhatsAppButton phoneNumber="919999999999" />}

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
