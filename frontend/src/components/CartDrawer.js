import React from 'react';
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const { cartItems, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, subtotal } = useCart();

  if (!isCartOpen) return null;

  const estimatedTax = subtotal * 0.0825;
  const total = subtotal + estimatedTax;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#171717] border-l border-[#2E2E2E] shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="px-6 py-5 bg-[#212121] border-b border-[#2E2E2E] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-[#C5A059]" />
              <h3 className="font-serif text-lg font-semibold text-[#FAF7F2] tracking-wider uppercase">
                Your Order Bag
              </h3>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 text-[#A39E93] hover:text-[#FAF7F2] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <ShoppingBag className="w-12 h-12 text-[#2E2E2E] mx-auto" />
                <p className="font-serif text-lg text-[#A39E93]">Your bag is currently empty.</p>
                <Link
                  to="/menu"
                  onClick={() => setIsCartOpen(false)}
                  className="inline-block bg-[#5C1D24] text-[#FAF7F2] px-6 py-2.5 text-xs font-semibold tracking-widest uppercase rounded-sm hover:bg-[#4A161D] transition-colors"
                >
                  Explore Menu
                </Link>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#212121] p-4 rounded-sm border border-[#2E2E2E] flex space-x-4 items-center"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-sm border border-[#2E2E2E]"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-serif text-base text-[#FAF7F2] font-semibold">
                      {item.name}
                    </h4>
                    <p className="text-xs text-[#C5A059] font-medium mt-0.5">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center space-x-3 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 text-[#A39E93] hover:text-[#FAF7F2] hover:bg-[#2E2E2E] rounded transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold text-[#FAF7F2] px-1">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 text-[#A39E93] hover:text-[#FAF7F2] hover:bg-[#2E2E2E] rounded transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1.5 text-[#A39E93] hover:text-red-400 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary */}
          {cartItems.length > 0 && (
            <div className="p-6 bg-[#212121] border-t border-[#2E2E2E] space-y-4">
              <div className="space-y-1.5 text-xs text-[#A39E93]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-[#FAF7F2] font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (8.25%)</span>
                  <span className="text-[#FAF7F2] font-medium">${estimatedTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-[#FAF7F2] pt-2 border-t border-[#2E2E2E]">
                  <span>Total</span>
                  <span className="text-[#C5A059]">${total.toFixed(2)}</span>
                </div>
              </div>

              <Link
                to="/cart"
                onClick={() => setIsCartOpen(false)}
                className="w-full bg-[#5C1D24] hover:bg-[#4A161D] text-[#FAF7F2] py-3 text-xs tracking-widest uppercase font-semibold rounded-sm transition-colors flex items-center justify-center space-x-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 text-[#C5A059]" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
