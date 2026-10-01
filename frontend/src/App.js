import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';

import Home from './pages/Home';
import Menu from './pages/Menu';
import About from './pages/About';
import Catering from './pages/Catering';
import PrivateEvents from './pages/PrivateEvents';
import Gallery from './pages/Gallery';
import Reservations from './pages/Reservations';
import OrderOnline from './pages/OrderOnline';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import ReservationSuccess from './pages/ReservationSuccess';
import CateringSuccess from './pages/CateringSuccess';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Router>
      <CartProvider>
        <div className="min-h-screen bg-[#0D0D0D] text-[#ECE6DA] flex flex-col font-sans selection:bg-[#5C1D24] selection:text-[#FAF7F2]">
          <Header />
          <CartDrawer />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/about" element={<About />} />
              <Route path="/catering" element={<Catering />} />
              <Route path="/private-events" element={<PrivateEvents />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/reservations" element={<Reservations />} />
              <Route path="/order-online" element={<OrderOnline />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/reservation-success" element={<ReservationSuccess />} />
              <Route path="/catering-success" element={<CateringSuccess />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </CartProvider>
    </Router>
  );
}
