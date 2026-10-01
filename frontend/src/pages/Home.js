import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Utensils, ArrowRight, Star, Clock, MapPin } from 'lucide-react';
import { RESTAURANT_INFO, MENU_ITEMS, TESTIMONIAL_PLACEHOLDERS } from '../data/restaurantData';
import { useCart } from '../context/CartContext';

export default function Home() {
  const { addToCart } = useCart();
  const signatureDishes = MENU_ITEMS.filter((dish) => dish.isSignature).slice(0, 4);

  return (
    <div className="space-y-24 pb-12">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center rounded-sm overflow-hidden border border-[#2E2E2E] shadow-2xl mt-4">
        {/* Hero Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=2000')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/75 to-[#0D0D0D]/50" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl text-center px-6 py-20 space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#212121]/80 border border-[#C5A059]/30 rounded-full text-[#C5A059] text-xs font-semibold tracking-widest uppercase">
            <Star className="w-3.5 h-3.5 fill-[#C5A059]" />
            <span>Premium Indian Dining</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#FAF7F2] leading-tight">
            {RESTAURANT_INFO.name}
          </h1>

          <p className="font-serif text-xl sm:text-2xl text-[#C5A059] italic font-normal max-w-2xl mx-auto">
            {RESTAURANT_INFO.tagline}
          </p>

          <p className="text-sm sm:text-base text-[#ECE6DA]/90 max-w-2xl mx-auto leading-relaxed font-light">
            An extraordinary culinary journey through India’s rich gastronomic heritage. Slow-cooked curries, fragrant biryanis, and aromatic tandoori specialties served with warm, timeless hospitality.
          </p>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/reservations"
              className="w-full sm:w-auto bg-[#5C1D24] hover:bg-[#4A161D] text-[#FAF7F2] px-8 py-3.5 rounded-sm text-xs tracking-widest uppercase font-semibold transition-all shadow-xl flex items-center justify-center space-x-2 border border-[#FAF7F2]/10"
            >
              <Calendar className="w-4 h-4 text-[#C5A059]" />
              <span>Reserve A Table</span>
            </Link>

            <Link
              to="/menu"
              className="w-full sm:w-auto bg-[#212121] hover:bg-[#FAF7F2] text-[#FAF7F2] hover:text-[#0D0D0D] border border-[#2E2E2E] px-8 py-3.5 rounded-sm text-xs tracking-widest uppercase font-semibold transition-all flex items-center justify-center space-x-2"
            >
              <Utensils className="w-4 h-4 text-[#C5A059]" />
              <span>Explore Menu</span>
            </Link>

            <Link
              to="/order-online"
              className="w-full sm:w-auto border border-[#C5A059]/60 hover:border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059]/10 px-8 py-3.5 rounded-sm text-xs tracking-widest uppercase font-semibold transition-all"
            >
              Order Online
            </Link>
          </div>

          {/* Quick info strip */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-[#A39E93]">
            <div className="flex items-center space-x-1.5">
              <MapPin className="w-4 h-4 text-[#C5A059]" />
              <span>{RESTAURANT_INFO.address}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-[#C5A059]" />
              <span>Open Daily from 11:30 AM</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. OUR STORY (EDITORIAL ASYMMETRIC SECTION) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-bold">
              OUR STORY & PHILOSOPHY
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#FAF7F2] leading-tight font-bold">
              "Tradition on every plate."
            </h2>
            <p className="text-sm sm:text-base text-[#A39E93] leading-relaxed">
              At KAITIND RESTAURANT, we believe authentic Indian cooking is an art form rooted in patience, family tradition, and time-honored recipes passed through generations.
            </p>
            <p className="text-sm sm:text-base text-[#A39E93] leading-relaxed">
              Every dish is crafted using whole hand-ground spices, clay tandoor cooking, and slow charcoal simmering. From royal North Indian curries to coastal seafood delicacies, our kitchen preserves regional authenticity while presenting food in an elegant, modern environment.
            </p>
            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center space-x-2 text-xs font-semibold tracking-widest uppercase text-[#C5A059] hover:text-[#FAF7F2] transition-colors border-b border-[#C5A059] pb-1"
              >
                <span>Read Full Story</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative rounded-sm overflow-hidden border border-[#2E2E2E] shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&q=80&w=1000"
                alt="Culinary Creation"
                className="w-full h-[450px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D]/60 via-transparent to-transparent" />
            </div>
            {/* Accent floating box */}
            <div className="absolute -bottom-6 -left-6 bg-[#171717] border border-[#2E2E2E] p-6 rounded-sm shadow-2xl hidden sm:block max-w-xs">
              <p className="font-serif text-lg text-[#C5A059] italic font-semibold">
                Slow charcoal cooked, infused with hand-picked spices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SIGNATURE DISHES */}
      <section className="bg-[#171717] border-y border-[#2E2E2E] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-bold">
              CHEF RECOMMENDATIONS
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#FAF7F2] font-bold">
              SIGNATURE DISHES
            </h2>
            <div className="w-16 h-[2px] bg-[#C5A059] mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {signatureDishes.map((dish) => (
              <div
                key={dish.id}
                className="bg-[#212121] border border-[#2E2E2E] rounded-sm overflow-hidden flex flex-col justify-between hover:border-[#C5A059]/50 transition-all group shadow-md"
              >
                <div>
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-[#0D0D0D]/80 backdrop-blur-md px-2.5 py-1 text-[#C5A059] font-serif text-sm font-semibold rounded-sm border border-[#2E2E2E]">
                      ${dish.price.toFixed(2)}
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif text-xl text-[#FAF7F2] font-semibold group-hover:text-[#C5A059] transition-colors">
                        {dish.name}
                      </h3>
                    </div>
                    <p className="text-xs text-[#A39E93] leading-relaxed line-clamp-3">
                      {dish.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => addToCart(dish)}
                    className="w-full bg-[#171717] hover:bg-[#5C1D24] text-[#FAF7F2] py-2 text-xs font-semibold tracking-widest uppercase border border-[#2E2E2E] hover:border-[#5C1D24] rounded-sm transition-colors"
                  >
                    Add to Order
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <Link
              to="/menu"
              className="inline-flex items-center space-x-2 bg-[#5C1D24] hover:bg-[#4A161D] text-[#FAF7F2] px-8 py-3 rounded-sm text-xs tracking-widest uppercase font-semibold transition-all border border-[#FAF7F2]/10 shadow-lg"
            >
              <span>View Full Menu</span>
              <ArrowRight className="w-4 h-4 text-[#C5A059]" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. MENU PREVIEW SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#2E2E2E] pb-6">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-bold">
              AUTHENTIC FLAVORS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#FAF7F2] font-bold">
              EXPLORE OUR MENU
            </h2>
          </div>
          <Link
            to="/menu"
            className="mt-4 md:mt-0 text-xs uppercase tracking-widest text-[#C5A059] hover:text-[#FAF7F2] font-semibold flex items-center space-x-1"
          >
            <span>Browse Full Menu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Menu Grid - Traditional Restaurant Menu Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          {MENU_ITEMS.slice(0, 8).map((item) => (
            <div
              key={item.id}
              className="border-b border-[#2E2E2E]/60 pb-4 flex justify-between items-start space-x-4"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-serif text-lg text-[#FAF7F2] font-semibold">
                    {item.name}
                  </h3>
                  {item.dietary?.map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] px-1.5 py-0.5 bg-[#212121] text-[#C5A059] border border-[#2E2E2E] rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-[#A39E93] leading-relaxed">
                  {item.description}
                </p>
              </div>
              <span className="font-serif text-base text-[#C5A059] font-semibold shrink-0">
                ${item.price.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 5. CATERING & PRIVATE EVENTS CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Catering Box */}
          <div className="relative rounded-sm overflow-hidden border border-[#2E2E2E] p-10 flex flex-col justify-between h-80 group">
            <div
              className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&q=80&w=1000')`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/80 to-[#0D0D0D]/60" />
            </div>
            <div className="relative z-10 space-y-3">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-semibold">
                EVENTS & GATHERINGS
              </span>
              <h3 className="font-serif text-3xl text-[#FAF7F2] font-bold">
                CATERING SERVICES
              </h3>
              <p className="text-xs text-[#A39E93] max-w-sm leading-relaxed">
                Bring the authentic taste of KAITIND RESTAURANT to your weddings, corporate functions, and private celebrations.
              </p>
            </div>
            <div className="relative z-10 pt-4">
              <Link
                to="/catering"
                className="inline-block bg-[#212121] hover:bg-[#C5A059] text-[#FAF7F2] hover:text-[#0D0D0D] px-6 py-2.5 text-xs font-semibold tracking-widest uppercase border border-[#2E2E2E] rounded-sm transition-all"
              >
                Request Catering
              </Link>
            </div>
          </div>

          {/* Private Events Box */}
          <div className="relative rounded-sm overflow-hidden border border-[#2E2E2E] p-10 flex flex-col justify-between h-80 group">
            <div
              className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1000')`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/80 to-[#0D0D0D]/60" />
            </div>
            <div className="relative z-10 space-y-3">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-semibold">
                PRIVATE DINING
              </span>
              <h3 className="font-serif text-3xl text-[#FAF7F2] font-bold">
                PRIVATE EVENTS
              </h3>
              <p className="text-xs text-[#A39E93] max-w-sm leading-relaxed">
                Exclusive dining spaces designed for intimate dinners, family reunions, and milestone occasions.
              </p>
            </div>
            <div className="relative z-10 pt-4">
              <Link
                to="/private-events"
                className="inline-block bg-[#5C1D24] hover:bg-[#4A161D] text-[#FAF7F2] px-6 py-2.5 text-xs font-semibold tracking-widest uppercase border border-[#FAF7F2]/10 rounded-sm transition-all"
              >
                Plan Your Event
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS PLACEHOLDER */}
      <section className="bg-[#171717] border-t border-[#2E2E2E] py-16">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-8">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-bold">
              GUEST EXPERIENCES
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#FAF7F2] font-bold">
              WHAT OUR GUESTS SAY
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            {TESTIMONIAL_PLACEHOLDERS.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#212121] border border-[#2E2E2E] p-6 rounded-sm text-left flex flex-col justify-between space-y-4"
              >
                <div className="flex text-[#C5A059] space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#C5A059]" />
                  ))}
                </div>
                <p className="text-xs text-[#ECE6DA]/90 italic leading-relaxed">
                  {item.quote}
                </p>
                <div className="pt-2 border-t border-[#2E2E2E]">
                  <p className="font-serif text-sm font-semibold text-[#FAF7F2]">
                    {item.author}
                  </p>
                  <p className="text-[10px] text-[#A39E93] uppercase tracking-wider">
                    {item.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
