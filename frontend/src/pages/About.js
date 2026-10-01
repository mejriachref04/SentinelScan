import React from 'react';
import { Flame, Heart, Sparkles } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';

export default function About() {
  return (
    <div className="space-y-20 pb-16">
      {/* Banner */}
      <div className="relative py-20 px-6 rounded-sm bg-[#171717] border border-[#2E2E2E] text-center space-y-4 shadow-xl">
        <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-bold">
          OUR CULINARY JOURNEY
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl text-[#FAF7F2] font-bold">
          ABOUT {RESTAURANT_INFO.name}
        </h1>
        <p className="text-xs sm:text-sm text-[#A39E93] max-w-xl mx-auto leading-relaxed">
          Crafting fine authentic Indian cuisine with royal heritage, hand-selected spices, and unyielding commitment to hospitality.
        </p>
      </div>

      {/* Main Editorial Story */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-6">
          <span className="text-xs uppercase tracking-[0.2em] text-[#C5A059] font-semibold">
            THE PHILOSOPHY
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#FAF7F2] font-bold leading-tight">
            [RESTAURANT STORY & HERITAGE]
          </h2>
          <p className="text-xs sm:text-sm text-[#A39E93] leading-relaxed">
            Founded with a passion to bring true, uncompromised flavors of Indian royal kitchens, KAITIND RESTAURANT serves dishes prepared using centuries-old techniques.
          </p>
          <p className="text-xs sm:text-sm text-[#A39E93] leading-relaxed">
            We source highest quality whole spices, fresh produce, and local organic proteins. Every curry simmered in our kitchen reflects hours of dedicated craftsmanship—combining warmth, aroma, and refined textures.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#2E2E2E]">
            <div>
              <p className="font-serif text-2xl font-bold text-[#C5A059]">100%</p>
              <p className="text-xs text-[#A39E93]">Authentic Spices & Pastes</p>
            </div>
            <div>
              <p className="font-serif text-2xl font-bold text-[#C5A059]">Clay Oven</p>
              <p className="text-xs text-[#A39E93]">Traditional Tandoori Cooking</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="relative rounded-sm overflow-hidden border border-[#2E2E2E] shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1000"
              alt="Restaurant Atmosphere"
              className="w-full h-[450px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D]/50 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* Chef & Team Section */}
      <section className="bg-[#171717] border border-[#2E2E2E] rounded-sm p-8 sm:p-12 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-bold">
            MASTER CULINARIANS
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#FAF7F2] font-bold">
            EXECUTIVE CHEF & KITCHEN TEAM
          </h2>
          <div className="w-12 h-[2px] bg-[#C5A059] mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-4">
          <img
            src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=800"
            alt="Executive Chef"
            className="w-full h-80 object-cover rounded-sm border border-[#2E2E2E]"
          />
          <div className="space-y-4">
            <h3 className="font-serif text-2xl text-[#FAF7F2] font-semibold">
              [CHEF NAME]
            </h3>
            <p className="text-xs text-[#C5A059] uppercase tracking-wider font-semibold">
              Executive Culinary Director
            </p>
            <p className="text-xs sm:text-sm text-[#A39E93] leading-relaxed">
              [CHEF BIOGRAPHY & EXPERIENCE PLACEHOLDER] — Dedicated to honoring traditional Indian recipes while presenting them with artistic precision. Our kitchen team brings deep expertise across tandoori roasting, slow dum cooking, and regional spice blending.
            </p>
          </div>
        </div>
      </section>

      {/* Culinary Values */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#171717] border border-[#2E2E2E] p-6 rounded-sm space-y-3">
          <Flame className="w-6 h-6 text-[#C5A059]" />
          <h4 className="font-serif text-xl font-semibold text-[#FAF7F2]">
            Clay Oven Tandoor
          </h4>
          <p className="text-xs text-[#A39E93] leading-relaxed">
            Meats and breads baked over intense charcoal heat, sealing in smoky flavor and tenderness.
          </p>
        </div>

        <div className="bg-[#171717] border border-[#2E2E2E] p-6 rounded-sm space-y-3">
          <Sparkles className="w-6 h-6 text-[#C5A059]" />
          <h4 className="font-serif text-xl font-semibold text-[#FAF7F2]">
            Artisanal Spices
          </h4>
          <p className="text-xs text-[#A39E93] leading-relaxed">
            Whole spices roasted in-house daily to deliver fragrant, rich, and balanced taste profiles.
          </p>
        </div>

        <div className="bg-[#171717] border border-[#2E2E2E] p-6 rounded-sm space-y-3">
          <Heart className="w-6 h-6 text-[#C5A059]" />
          <h4 className="font-serif text-xl font-semibold text-[#FAF7F2]">
            Genuine Hospitality
          </h4>
          <p className="text-xs text-[#A39E93] leading-relaxed">
            'Atithi Devo Bhava' — treating every guest like a honored deity with heartfelt care.
          </p>
        </div>
      </section>
    </div>
  );
}
