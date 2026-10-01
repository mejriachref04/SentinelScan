import React, { useState } from 'react';
import { Sparkles, Users, Wine, Clock, Check } from 'lucide-react';

export default function PrivateEvents() {
  const [submitted, setSubmitted] = useState(false);
  const [eventData, setEventData] = useState({
    name: '',
    email: '',
    phone: '',
    eventDate: '',
    timeSlot: '7:00 PM',
    guestCount: '25-40',
    eventType: 'Private Party',
    specialNotes: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Header Banner */}
      <div className="relative py-20 px-6 rounded-sm bg-[#171717] border border-[#2E2E2E] text-center space-y-4 shadow-xl">
        <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-bold">
          EXCLUSIVITY & CELEBRATION
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl text-[#FAF7F2] font-bold">
          PRIVATE EVENTS & DINING
        </h1>
        <p className="text-xs sm:text-sm text-[#A39E93] max-w-xl mx-auto leading-relaxed">
          Host your private celebrations in an intimate atmosphere surrounded by authentic Indian design and curated culinary menus.
        </p>
      </div>

      {/* Main Feature Showcase */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 relative rounded-sm overflow-hidden border border-[#2E2E2E]">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1000"
            alt="Private Dining Room"
            className="w-full h-[400px] object-cover"
          />
        </div>

        <div className="lg:col-span-6 space-y-6">
          <span className="text-xs uppercase tracking-[0.2em] text-[#C5A059] font-semibold">
            THE PRIVATE DINING ROOM
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#FAF7F2] font-bold">
            An Unforgettable Setting
          </h2>
          <p className="text-xs sm:text-sm text-[#A39E93] leading-relaxed">
            Whether hosting an intimate dinner party or an executive board dinner, our private dining suite accommodates up to 60 seated guests. Enjoy dedicated service staff, custom sommelier wine pairings, and customized pre-fixe menus.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2 text-xs text-[#ECE6DA]">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-[#C5A059]" />
              <span>Up to 60 Seated Guests</span>
            </div>
            <div className="flex items-center space-x-2">
              <Wine className="w-4 h-4 text-[#C5A059]" />
              <span>Sommelier & Cocktail Bar</span>
            </div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#C5A059]" />
              <span>Custom Multi-Course Menu</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-[#C5A059]" />
              <span>Flexible Event Hours</span>
            </div>
          </div>
        </div>
      </section>

      {/* Event Request Form */}
      <section className="bg-[#171717] border border-[#2E2E2E] rounded-sm p-8 sm:p-12">
        {submitted ? (
          <div className="text-center py-12 space-y-4 max-w-md mx-auto">
            <Check className="w-12 h-12 text-[#C5A059] mx-auto bg-[#C5A059]/10 p-2.5 rounded-full border border-[#C5A059]/30" />
            <h3 className="font-serif text-3xl text-[#FAF7F2] font-bold">
              Event Inquiry Received
            </h3>
            <p className="text-xs text-[#A39E93] leading-relaxed">
              Thank you, {eventData.name}. Our private events manager will review your request for {eventData.eventDate} and reach out within 24 hours.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-bold">
                PLAN YOUR EVENT
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#FAF7F2] font-bold">
                RESERVE THE PRIVATE DINING SUITE
              </h2>
              <div className="w-12 h-[2px] bg-[#C5A059] mx-auto" />
            </div>

            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#A39E93] mb-1 font-semibold">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={eventData.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="w-full bg-[#212121] border border-[#2E2E2E] focus:border-[#C5A059] text-xs text-[#FAF7F2] px-4 py-3 rounded-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#A39E93] mb-1 font-semibold">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={eventData.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    className="w-full bg-[#212121] border border-[#2E2E2E] focus:border-[#C5A059] text-xs text-[#FAF7F2] px-4 py-3 rounded-sm outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#A39E93] mb-1 font-semibold">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={eventData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className="w-full bg-[#212121] border border-[#2E2E2E] focus:border-[#C5A059] text-xs text-[#FAF7F2] px-4 py-3 rounded-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#A39E93] mb-1 font-semibold">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    name="eventDate"
                    required
                    value={eventData.eventDate}
                    onChange={handleChange}
                    className="w-full bg-[#212121] border border-[#2E2E2E] focus:border-[#C5A059] text-xs text-[#FAF7F2] px-4 py-3 rounded-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#A39E93] mb-1 font-semibold">
                    Guest Count
                  </label>
                  <select
                    name="guestCount"
                    value={eventData.guestCount}
                    onChange={handleChange}
                    className="w-full bg-[#212121] border border-[#2E2E2E] focus:border-[#C5A059] text-xs text-[#FAF7F2] px-4 py-3 rounded-sm outline-none"
                  >
                    <option>10-20 Guests</option>
                    <option>20-40 Guests</option>
                    <option>40-60 Guests</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#A39E93] mb-1 font-semibold">
                  Special Notes or Custom Requests
                </label>
                <textarea
                  name="specialNotes"
                  rows={4}
                  value={eventData.specialNotes}
                  onChange={handleChange}
                  placeholder="Share details regarding wine pairings, audio/visual requirements, or dietary needs..."
                  className="w-full bg-[#212121] border border-[#2E2E2E] focus:border-[#C5A059] text-xs text-[#FAF7F2] p-4 rounded-sm outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#5C1D24] hover:bg-[#4A161D] text-[#FAF7F2] py-3.5 text-xs font-semibold tracking-widest uppercase rounded-sm transition-colors shadow-lg border border-[#FAF7F2]/10"
              >
                Submit Private Event Request
              </button>
            </form>
          </div>
        )}
      </section>
    </div>
  );
}
