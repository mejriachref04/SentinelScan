import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, Mail, Phone, CheckCircle } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';

export default function Catering() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventDate: '',
    eventType: 'Corporate Event',
    guestCount: '50-100',
    location: '',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/catering-success', { state: { ...formData } });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Header Banner */}
      <div className="relative py-20 px-6 rounded-sm bg-[#171717] border border-[#2E2E2E] text-center space-y-4 shadow-xl">
        <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-bold">
          ELEVATED CULINARY EXPERIENCES
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl text-[#FAF7F2] font-bold">
          CATERING SERVICES
        </h1>
        <p className="text-xs sm:text-sm text-[#A39E93] max-w-xl mx-auto leading-relaxed">
          Bring KAITIND RESTAURANT to your next gathering. Authentic Indian menus tailored for corporate galas, weddings, and private family celebrations.
        </p>
      </div>

      {/* Catering Event Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#171717] border border-[#2E2E2E] p-8 rounded-sm space-y-3 hover:border-[#C5A059]/40 transition-colors">
          <Users className="w-8 h-8 text-[#C5A059]" />
          <h3 className="font-serif text-2xl text-[#FAF7F2] font-semibold">
            Corporate Dinners
          </h3>
          <p className="text-xs text-[#A39E93] leading-relaxed">
            Impress clients and colleagues with individually packaged executive lunches or opulent buffet setups.
          </p>
        </div>

        <div className="bg-[#171717] border border-[#2E2E2E] p-8 rounded-sm space-y-3 hover:border-[#C5A059]/40 transition-colors">
          <Calendar className="w-8 h-8 text-[#C5A059]" />
          <h3 className="font-serif text-2xl text-[#FAF7F2] font-semibold">
            Weddings & Galas
          </h3>
          <p className="text-xs text-[#A39E93] leading-relaxed">
            Unforgettable multi-course Indian banquets with live tandoor stations, chafing displays, and dessert bars.
          </p>
        </div>

        <div className="bg-[#171717] border border-[#2E2E2E] p-8 rounded-sm space-y-3 hover:border-[#C5A059]/40 transition-colors">
          <CheckCircle className="w-8 h-8 text-[#C5A059]" />
          <h3 className="font-serif text-2xl text-[#FAF7F2] font-semibold">
            Family Celebrations
          </h3>
          <p className="text-xs text-[#A39E93] leading-relaxed">
            Birthdays, anniversaries, and festive gatherings with customizable spice profiles and dietary options.
          </p>
        </div>
      </div>

      {/* Inquiry Form Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-[#171717] border border-[#2E2E2E] rounded-sm p-8 sm:p-12">
        <div className="lg:col-span-5 space-y-6">
          <span className="text-xs uppercase tracking-[0.2em] text-[#C5A059] font-bold">
            GET IN TOUCH
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#FAF7F2] font-bold">
            REQUEST CATERING
          </h2>
          <p className="text-xs sm:text-sm text-[#A39E93] leading-relaxed">
            Please fill out the form with your event details. Our catering coordinator will contact you within 24 hours to craft a custom menu.
          </p>

          <div className="space-y-4 pt-4 border-t border-[#2E2E2E] text-xs text-[#ECE6DA]">
            <div className="flex items-center space-x-3">
              <Phone className="w-4 h-4 text-[#C5A059]" />
              <span>Direct Line: {RESTAURANT_INFO.phone}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="w-4 h-4 text-[#C5A059]" />
              <span>Email: {RESTAURANT_INFO.email}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#A39E93] mb-1 font-semibold">
                Your Full Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
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
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="w-full bg-[#212121] border border-[#2E2E2E] focus:border-[#C5A059] text-xs text-[#FAF7F2] px-4 py-3 rounded-sm outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#A39E93] mb-1 font-semibold">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="(555) 000-0000"
                className="w-full bg-[#212121] border border-[#2E2E2E] focus:border-[#C5A059] text-xs text-[#FAF7F2] px-4 py-3 rounded-sm outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#A39E93] mb-1 font-semibold">
                Event Date *
              </label>
              <input
                type="date"
                name="eventDate"
                required
                value={formData.eventDate}
                onChange={handleChange}
                className="w-full bg-[#212121] border border-[#2E2E2E] focus:border-[#C5A059] text-xs text-[#FAF7F2] px-4 py-3 rounded-sm outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#A39E93] mb-1 font-semibold">
                Event Type
              </label>
              <select
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
                className="w-full bg-[#212121] border border-[#2E2E2E] focus:border-[#C5A059] text-xs text-[#FAF7F2] px-4 py-3 rounded-sm outline-none"
              >
                <option>Corporate Event</option>
                <option>Wedding Banquet</option>
                <option>Birthday / Anniversary</option>
                <option>Family Gathering</option>
                <option>Other Private Event</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#A39E93] mb-1 font-semibold">
                Estimated Guest Count
              </label>
              <select
                name="guestCount"
                value={formData.guestCount}
                onChange={handleChange}
                className="w-full bg-[#212121] border border-[#2E2E2E] focus:border-[#C5A059] text-xs text-[#FAF7F2] px-4 py-3 rounded-sm outline-none"
              >
                <option>20-50 Guests</option>
                <option>50-100 Guests</option>
                <option>100-200 Guests</option>
                <option>200+ Guests</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#A39E93] mb-1 font-semibold">
              Event Venue / Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Venue address or city"
              className="w-full bg-[#212121] border border-[#2E2E2E] focus:border-[#C5A059] text-xs text-[#FAF7F2] px-4 py-3 rounded-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#A39E93] mb-1 font-semibold">
              Additional Details & Dietary Preferences
            </label>
            <textarea
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us about your menu preferences, dietary needs, or special setup instructions..."
              className="w-full bg-[#212121] border border-[#2E2E2E] focus:border-[#C5A059] text-xs text-[#FAF7F2] p-4 rounded-sm outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#5C1D24] hover:bg-[#4A161D] text-[#FAF7F2] py-3.5 text-xs font-semibold tracking-widest uppercase rounded-sm border border-[#FAF7F2]/10 transition-colors shadow-lg"
          >
            Submit Catering Request
          </button>
        </form>
      </div>
    </div>
  );
}
