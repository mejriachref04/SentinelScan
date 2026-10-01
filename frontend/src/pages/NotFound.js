import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils, Home as HomeIcon } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center py-16">
      <div className="bg-[#171717] border border-[#2E2E2E] rounded-sm p-8 sm:p-12 text-center max-w-lg mx-auto space-y-6 shadow-2xl">
        <span className="font-serif text-6xl text-[#C5A059] font-bold block">
          404
        </span>
        <h1 className="font-serif text-3xl font-semibold text-[#FAF7F2]">
          Page Not Found
        </h1>
        <p className="text-xs sm:text-sm text-[#A39E93] leading-relaxed">
          The page you are looking for does not exist or may have been moved. Return to our homepage to explore {RESTAURANT_INFO.name}.
        </p>
        <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="bg-[#5C1D24] hover:bg-[#4A161D] text-[#FAF7F2] px-6 py-3 text-xs font-semibold uppercase tracking-widest rounded-sm transition-colors flex items-center justify-center space-x-2 border border-[#FAF7F2]/10"
          >
            <HomeIcon className="w-4 h-4 text-[#C5A059]" />
            <span>Return Home</span>
          </Link>

          <Link
            to="/menu"
            className="bg-[#212121] hover:bg-[#C5A059] text-[#FAF7F2] hover:text-[#0D0D0D] border border-[#2E2E2E] px-6 py-3 text-xs font-semibold uppercase tracking-widest rounded-sm transition-colors flex items-center justify-center space-x-2"
          >
            <Utensils className="w-4 h-4" />
            <span>Browse Menu</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
