import React from 'react';
import { X } from 'lucide-react';

export default function Lightbox({ image, title, category, onClose }) {
  if (!image) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-[#ECE6DA] hover:text-[#C5A059] p-2 rounded-full bg-[#212121]/80 transition-colors"
        aria-label="Close Lightbox"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="max-w-4xl max-h-[85vh] flex flex-col items-center">
        <img
          src={image}
          alt={title || 'Gallery Preview'}
          className="max-w-full max-h-[75vh] object-contain rounded-sm border border-[#2E2E2E] shadow-2xl"
        />
        {(title || category) && (
          <div className="mt-4 text-center space-y-1">
            {category && (
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-semibold">
                {category}
              </span>
            )}
            {title && (
              <h3 className="font-serif text-xl text-[#FAF7F2] font-semibold">
                {title}
              </h3>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
