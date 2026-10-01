import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu as MenuIcon, X, Calendar, Phone } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { RESTAURANT_INFO } from '../data/restaurantData';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItemCount, setIsCartOpen } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on page navigate
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'MENU', path: '/menu' },
    { name: 'ABOUT', path: '/about' },
    { name: 'CATERING', path: '/catering' },
    { name: 'PRIVATE EVENTS', path: '/private-events' },
    { name: 'GALLERY', path: '/gallery' },
    { name: 'RESERVATIONS', path: '/reservations' },
    { name: 'CONTACT', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0D0D00D0]/95 backdrop-blur-md border-b border-[#2E2E2E] py-3 shadow-2xl'
          : 'bg-gradient-to-b from-[#0D0D0D]/90 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex flex-col group">
          <span className="font-serif text-2xl sm:text-3xl font-bold tracking-widest text-[#FAF7F2] group-hover:text-[#C5A059] transition-colors">
            {RESTAURANT_INFO.name}
          </span>
          <span className="text-[9px] sm:text-[10px] tracking-[0.25em] text-[#C5A059] uppercase font-medium">
            Authentic Indian Cuisine
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-xs tracking-widest transition-colors font-medium relative py-1 ${
                isActive(link.path)
                  ? 'text-[#C5A059]'
                  : 'text-[#ECE6DA]/80 hover:text-[#FAF7F2]'
              }`}
            >
              {link.name}
              {isActive(link.path) && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C5A059] rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Order Online Button (Secondary) */}
          <Link
            to="/order-online"
            className="hidden sm:inline-flex items-center px-4 py-2 border border-[#C5A059]/40 hover:border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059]/10 text-xs tracking-widest uppercase transition-all rounded-sm font-medium"
          >
            Order Online
          </Link>

          {/* Reserve CTA */}
          <Link
            to="/reservations"
            className="inline-flex items-center space-x-2 bg-[#5C1D24] hover:bg-[#4A161D] text-[#FAF7F2] px-4 py-2.5 sm:px-5 sm:py-2.5 rounded-sm text-xs tracking-widest uppercase font-semibold transition-all shadow-md hover:shadow-lg border border-[#FAF7F2]/10"
          >
            <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
            <span className="hidden sm:inline">Reserve A Table</span>
            <span className="sm:hidden">Reserve</span>
          </Link>

          {/* Cart Icon Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 text-[#ECE6DA] hover:text-[#C5A059] transition-colors rounded-full hover:bg-[#212121]"
            aria-label="Open Shopping Bag"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#D97706] text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-[#0D0D0D]">
                {totalItemCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#ECE6DA] hover:text-[#C5A059] focus:outline-none"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[65px] bg-[#0D0D0D]/98 backdrop-blur-xl z-40 flex flex-col justify-between p-6 border-t border-[#2E2E2E] animate-fadeIn overflow-y-auto">
          <nav className="flex flex-col space-y-4 pt-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-base tracking-widest py-2 border-b border-[#2E2E2E]/40 font-serif ${
                  isActive(link.path)
                    ? 'text-[#C5A059] font-bold'
                    : 'text-[#ECE6DA] hover:text-[#FAF7F2]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col space-y-3 pt-6 pb-12 border-t border-[#2E2E2E]">
            <Link
              to="/order-online"
              className="w-full text-center border border-[#C5A059] text-[#C5A059] py-3 text-xs tracking-widest uppercase font-semibold rounded-sm"
            >
              Order Online
            </Link>
            <Link
              to="/reservations"
              className="w-full text-center bg-[#5C1D24] text-[#FAF7F2] py-3 text-xs tracking-widest uppercase font-semibold rounded-sm shadow-lg"
            >
              Reserve A Table
            </Link>
            <div className="flex items-center justify-center space-x-2 pt-2 text-xs text-[#A39E93]">
              <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Call: {RESTAURANT_INFO.phone}</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
