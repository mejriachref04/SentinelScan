import React, { useState } from 'react';
import { ShoppingBag, Plus, Star } from 'lucide-react';
import { MENU_CATEGORIES, MENU_ITEMS } from '../data/restaurantData';
import { useCart } from '../context/CartContext';

export default function OrderOnline() {
  const [selectedCat, setSelectedCat] = useState('ALL');
  const { addToCart, setIsCartOpen, totalItemCount } = useCart();

  const filtered = MENU_ITEMS.filter(
    (item) => selectedCat === 'ALL' || item.category === selectedCat
  );

  return (
    <div className="space-y-12 pb-16">
      {/* Banner */}
      <div className="relative py-16 px-6 rounded-sm bg-[#171717] border border-[#2E2E2E] text-center space-y-4 shadow-xl">
        <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-bold">
          CONVENIENT PICKUP & DELIVERY
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl text-[#FAF7F2] font-bold">
          ORDER ONLINE
        </h1>
        <p className="text-xs sm:text-sm text-[#A39E93] max-w-xl mx-auto leading-relaxed">
          Select your favorite Indian dishes, add them to your order bag, and complete checkout. Prepared fresh upon order.
        </p>
      </div>

      {/* Floating Order Bag trigger on mobile */}
      <div className="fixed bottom-6 right-6 z-40 sm:hidden">
        <button
          onClick={() => setIsCartOpen(true)}
          className="bg-[#5C1D24] text-[#FAF7F2] p-4 rounded-full shadow-2xl flex items-center space-x-2 border border-[#C5A059]/40"
        >
          <ShoppingBag className="w-5 h-5 text-[#C5A059]" />
          <span className="text-xs font-bold uppercase">{totalItemCount} Items</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-2 gap-2">
        {MENU_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-4 py-2 text-[11px] font-semibold tracking-wider uppercase rounded-sm border whitespace-nowrap transition-all ${
              selectedCat === cat
                ? 'bg-[#5C1D24] text-[#FAF7F2] border-[#5C1D24]'
                : 'bg-[#171717] text-[#A39E93] border-[#2E2E2E] hover:text-[#FAF7F2]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Online Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-[#171717] border border-[#2E2E2E] p-5 rounded-sm flex space-x-4 items-center justify-between hover:border-[#C5A059]/40 transition-colors"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-serif text-lg text-[#FAF7F2] font-semibold">
                  {item.name}
                </h3>
                {item.isSignature && (
                  <Star className="w-3.5 h-3.5 text-[#C5A059] fill-[#C5A059]" />
                )}
              </div>
              <p className="text-xs text-[#A39E93] line-clamp-2">
                {item.description}
              </p>
              <div className="pt-2 flex items-center justify-between">
                <span className="font-serif text-base text-[#C5A059] font-bold">
                  ${item.price.toFixed(2)}
                </span>
                <button
                  onClick={() => addToCart(item)}
                  className="bg-[#212121] hover:bg-[#5C1D24] text-[#FAF7F2] px-3 py-1.5 text-xs uppercase font-semibold tracking-wider rounded-sm border border-[#2E2E2E] hover:border-[#5C1D24] transition-colors flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Add to Bag</span>
                </button>
              </div>
            </div>

            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-sm border border-[#2E2E2E] shrink-0"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
