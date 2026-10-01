import React, { useState } from 'react';
import { GALLERY_ITEMS } from '../data/restaurantData';
import Lightbox from '../components/Lightbox';

export default function Gallery() {
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [activeLightboxImage, setActiveLightboxImage] = useState(null);

  const categories = ['ALL', 'FOOD', 'RESTAURANT', 'EVENTS', 'ATMOSPHERE'];

  const filteredItems = GALLERY_ITEMS.filter(
    (item) => selectedFilter === 'ALL' || item.category === selectedFilter
  );

  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <div className="relative py-20 px-6 rounded-sm bg-[#171717] border border-[#2E2E2E] text-center space-y-4 shadow-xl">
        <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-bold">
          VISUAL EXPERIENCE
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl text-[#FAF7F2] font-bold">
          PHOTOGRAPHY GALLERY
        </h1>
        <p className="text-xs sm:text-sm text-[#A39E93] max-w-xl mx-auto leading-relaxed">
          Explore the warmth, vibrant dishes, and elegant ambiance of KAITIND RESTAURANT. Click any image for expanded view.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center justify-center space-x-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedFilter(cat)}
            className={`px-4 py-2 text-[11px] font-semibold tracking-wider uppercase rounded-sm border whitespace-nowrap transition-all ${
              selectedFilter === cat
                ? 'bg-[#5C1D24] text-[#FAF7F2] border-[#5C1D24]'
                : 'bg-[#171717] text-[#A39E93] border-[#2E2E2E] hover:text-[#FAF7F2]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveLightboxImage(item)}
            className="group relative h-72 rounded-sm overflow-hidden border border-[#2E2E2E] cursor-pointer bg-[#171717]"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D]/90 via-[#0D0D0D]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-semibold">
                {item.category}
              </span>
              <h3 className="font-serif text-xl font-bold text-[#FAF7F2]">
                {item.title}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeLightboxImage && (
        <Lightbox
          image={activeLightboxImage.image}
          title={activeLightboxImage.title}
          category={activeLightboxImage.category}
          onClose={() => setActiveLightboxImage(null)}
        />
      )}
    </div>
  );
}
