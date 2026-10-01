import React, { useState } from 'react';
import { Search, Utensils, Plus } from 'lucide-react';
import { MENU_CATEGORIES, MENU_ITEMS } from '../data/restaurantData';
import { useCart } from '../context/CartContext';

export default function Menu() {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const { addToCart } = useCart();

  const filteredItems = MENU_ITEMS.filter((item) => {
    const matchesCategory =
      selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-12 pb-16">
      {/* Page Header Banner */}
      <div className="relative py-16 px-6 rounded-sm bg-[#171717] border border-[#2E2E2E] text-center space-y-4 shadow-xl">
        <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-bold">
          CUISINE & SPECIALTIES
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl text-[#FAF7F2] font-bold">
          OUR DINING MENU
        </h1>
        <p className="text-xs sm:text-sm text-[#A39E93] max-w-xl mx-auto leading-relaxed">
          Crafted with authentic Indian spices, house-made pastes, and traditional clay oven cooking. Select a category below or search for your favorite dish.
        </p>
      </div>

      {/* Category Pills & Search */}
      <div className="space-y-6">
        {/* Search input */}
        <div className="max-w-md mx-auto relative">
          <Search className="w-4 h-4 text-[#A39E93] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search menu by dish name or ingredient..."
            className="w-full bg-[#171717] border border-[#2E2E2E] focus:border-[#C5A059] text-xs text-[#FAF7F2] pl-10 pr-4 py-3 rounded-sm outline-none transition-colors"
          />
        </div>

        {/* Categories Bar */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-2 gap-2 scrollbar-none">
          {MENU_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-[11px] font-semibold tracking-wider uppercase rounded-sm border whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#5C1D24] text-[#FAF7F2] border-[#5C1D24] shadow-md'
                  : 'bg-[#171717] text-[#A39E93] border-[#2E2E2E] hover:text-[#FAF7F2] hover:border-[#C5A059]/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Grid */}
      <div className="space-y-8">
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-[#171717] border border-[#2E2E2E] rounded-sm space-y-3">
            <Utensils className="w-10 h-10 text-[#2E2E2E] mx-auto" />
            <p className="font-serif text-lg text-[#A39E93]">
              No dishes found matching your selection.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-[#171717] border border-[#2E2E2E] p-6 rounded-sm flex space-x-5 hover:border-[#C5A059]/40 transition-all justify-between"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-serif text-xl font-semibold text-[#FAF7F2]">
                      {item.name}
                    </h3>
                    {item.isSignature && (
                      <span className="text-[9px] px-2 py-0.5 bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/40 font-semibold uppercase tracking-wider rounded-sm">
                        Signature
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#A39E93] leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex items-center space-x-2 pt-1">
                    {item.dietary?.map((tag) => (
                      <span
                        key={tag}
                        className="text-[9px] px-2 py-0.5 bg-[#212121] text-[#A39E93] border border-[#2E2E2E] rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3 flex items-center justify-between">
                    <span className="font-serif text-lg font-bold text-[#C5A059]">
                      ${item.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => addToCart(item)}
                      className="inline-flex items-center space-x-1.5 bg-[#212121] hover:bg-[#5C1D24] text-[#FAF7F2] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-sm border border-[#2E2E2E] hover:border-[#5C1D24] transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>

                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-sm border border-[#2E2E2E] shrink-0"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
