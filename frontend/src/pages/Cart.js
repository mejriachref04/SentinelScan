import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Plus, Minus, Trash2, CheckCircle, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, clearCart, subtotal } = useCart();
  const [fulfillmentType, setFulfillmentType] = useState('pickup');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
  });

  const estimatedTax = subtotal * 0.0825;
  const deliveryFee = fulfillmentType === 'delivery' ? 4.99 : 0.0;
  const grandTotal = subtotal + estimatedTax + deliveryFee;

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    setOrderPlaced(true);
    clearCart();
  };

  const handleChange = (e) => {
    setCheckoutData({ ...checkoutData, [e.target.name]: e.target.value });
  };

  if (orderPlaced) {
    return (
      <div className="max-w-xl mx-auto my-16 bg-[#171717] border border-[#2E2E2E] rounded-sm p-8 sm:p-12 text-center space-y-6 shadow-2xl">
        <CheckCircle className="w-16 h-16 text-[#C5A059] mx-auto bg-[#C5A059]/10 p-3 rounded-full border border-[#C5A059]/30" />
        <h1 className="font-serif text-3xl sm:text-4xl text-[#FAF7F2] font-bold">
          ORDER RECEIVED
        </h1>
        <p className="text-xs sm:text-sm text-[#A39E93] leading-relaxed">
          Thank you, <strong className="text-[#FAF7F2]">{checkoutData.name}</strong>. Your online order has been transmitted to our kitchen. You will receive an SMS/email confirmation shortly.
        </p>

        <div className="bg-[#212121] p-4 rounded-sm border border-[#2E2E2E] text-left text-xs text-[#ECE6DA] space-y-2">
          <p><strong className="text-[#A39E93]">Fulfillment:</strong> {fulfillmentType.toUpperCase()}</p>
          <p><strong className="text-[#A39E93]">Estimated Ready Time:</strong> 25 – 35 Minutes</p>
          <p><strong className="text-[#A39E93]">Contact Phone:</strong> {checkoutData.phone}</p>
        </div>

        <Link
          to="/"
          className="inline-block bg-[#5C1D24] text-[#FAF7F2] px-8 py-3 text-xs font-semibold tracking-widest uppercase rounded-sm hover:bg-[#4A161D] transition-colors border border-[#FAF7F2]/10"
        >
          Return to Homepage
        </Link>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-lg mx-auto my-16 bg-[#171717] border border-[#2E2E2E] rounded-sm p-12 text-center space-y-6 shadow-xl">
        <ShoppingBag className="w-16 h-16 text-[#2E2E2E] mx-auto" />
        <h1 className="font-serif text-3xl text-[#FAF7F2] font-bold">
          YOUR ORDER BAG IS EMPTY
        </h1>
        <p className="text-xs text-[#A39E93]">
          Browse our authentic Indian dining menu and add dishes to your order bag.
        </p>
        <Link
          to="/menu"
          className="inline-block bg-[#5C1D24] text-[#FAF7F2] px-8 py-3 text-xs font-semibold tracking-widest uppercase rounded-sm hover:bg-[#4A161D] transition-colors"
        >
          Explore Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-16">
      <div className="flex items-center space-x-2 text-xs uppercase tracking-wider text-[#A39E93] pt-4">
        <Link to="/order-online" className="hover:text-[#FAF7F2] flex items-center space-x-1">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Menu</span>
        </Link>
      </div>

      <h1 className="font-serif text-3xl sm:text-5xl text-[#FAF7F2] font-bold">
        YOUR ORDER REVIEW
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Cart Item List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#171717] border border-[#2E2E2E] rounded-sm divide-y divide-[#2E2E2E]">
            {cartItems.map((item) => (
              <div key={item.id} className="p-4 sm:p-6 flex items-center justify-between space-x-4">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-sm border border-[#2E2E2E] shrink-0"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-serif text-lg font-semibold text-[#FAF7F2]">
                    {item.name}
                  </h3>
                  <p className="text-xs text-[#C5A059] font-medium">
                    ${item.price.toFixed(2)} each
                  </p>
                </div>

                <div className="flex items-center space-x-3 bg-[#212121] px-2 py-1 border border-[#2E2E2E] rounded-sm">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1 text-[#A39E93] hover:text-[#FAF7F2]"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-bold text-[#FAF7F2]">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 text-[#A39E93] hover:text-[#FAF7F2]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <span className="font-serif text-base text-[#FAF7F2] font-bold min-w-[60px] text-right">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-[#A39E93] hover:text-red-400 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Fulfillment & Summary */}
        <div className="lg:col-span-5 bg-[#171717] border border-[#2E2E2E] p-6 sm:p-8 rounded-sm space-y-6">
          <h2 className="font-serif text-2xl text-[#FAF7F2] font-semibold">
            CHECKOUT DETAILS
          </h2>

          {/* Fulfillment Toggle */}
          <div className="grid grid-cols-2 gap-2 bg-[#212121] p-1 border border-[#2E2E2E] rounded-sm">
            <button
              onClick={() => setFulfillmentType('pickup')}
              className={`py-2 text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors ${
                fulfillmentType === 'pickup'
                  ? 'bg-[#5C1D24] text-[#FAF7F2]'
                  : 'text-[#A39E93] hover:text-[#FAF7F2]'
              }`}
            >
              Curbside Pickup
            </button>
            <button
              onClick={() => setFulfillmentType('delivery')}
              className={`py-2 text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors ${
                fulfillmentType === 'delivery'
                  ? 'bg-[#5C1D24] text-[#FAF7F2]'
                  : 'text-[#A39E93] hover:text-[#FAF7F2]'
              }`}
            >
              Local Delivery (+$4.99)
            </button>
          </div>

          <form onSubmit={handleCheckoutSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#A39E93] mb-1 font-semibold">
                Your Full Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={checkoutData.name}
                onChange={handleChange}
                placeholder="Name"
                className="w-full bg-[#212121] border border-[#2E2E2E] focus:border-[#C5A059] text-xs text-[#FAF7F2] px-4 py-3 rounded-sm outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#A39E93] mb-1 font-semibold">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={checkoutData.email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                  className="w-full bg-[#212121] border border-[#2E2E2E] focus:border-[#C5A059] text-xs text-[#FAF7F2] px-4 py-3 rounded-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#A39E93] mb-1 font-semibold">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={checkoutData.phone}
                  onChange={handleChange}
                  placeholder="(555) 000-0000"
                  className="w-full bg-[#212121] border border-[#2E2E2E] focus:border-[#C5A059] text-xs text-[#FAF7F2] px-4 py-3 rounded-sm outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#A39E93] mb-1 font-semibold">
                Special Kitchen Notes
              </label>
              <textarea
                name="notes"
                rows={2}
                value={checkoutData.notes}
                onChange={handleChange}
                placeholder="Spice level adjustments, extra sauces..."
                className="w-full bg-[#212121] border border-[#2E2E2E] focus:border-[#C5A059] text-xs text-[#FAF7F2] p-3 rounded-sm outline-none"
              />
            </div>

            {/* Price breakdown */}
            <div className="pt-4 border-t border-[#2E2E2E] space-y-2 text-xs text-[#A39E93]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-[#FAF7F2]">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (8.25%)</span>
                <span className="text-[#FAF7F2]">${estimatedTax.toFixed(2)}</span>
              </div>
              {fulfillmentType === 'delivery' && (
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="text-[#FAF7F2]">$4.99</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-[#FAF7F2] pt-2 border-t border-[#2E2E2E]">
                <span>Total Amount</span>
                <span className="text-[#C5A059]">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#5C1D24] hover:bg-[#4A161D] text-[#FAF7F2] py-3.5 text-xs font-semibold tracking-widest uppercase rounded-sm transition-colors shadow-lg border border-[#FAF7F2]/10"
            >
              PLACE ORDER NOW
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
