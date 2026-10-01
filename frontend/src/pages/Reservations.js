import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Info } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';

export default function Reservations() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '07:00 PM',
    guests: '2 Guests',
    specialRequest: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/reservation-success', { state: { ...formData } });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Header Banner */}
      <div className="relative py-20 px-6 rounded-sm bg-[#171717] border border-[#2E2E2E] text-center space-y-4 shadow-xl">
        <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-bold">
          TABLE RESERVATIONS
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl text-[#FAF7F2] font-bold">
          JOIN US FOR DINING
        </h1>
        <p className="text-xs sm:text-sm text-[#A39E93] max-w-xl mx-auto leading-relaxed">
          Reserve your table online. Please note that online requests are held as pending until confirmed by our dining team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Reservation Form */}
        <div className="lg:col-span-7 bg-[#171717] border border-[#2E2E2E] p-8 sm:p-10 rounded-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="font-serif text-2xl text-[#FAF7F2] font-bold mb-4">
              RESERVATION REQUEST FORM
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#A39E93] mb-1 font-semibold">
                  Full Name *
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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full bg-[#212121] border border-[#2E2E2E] focus:border-[#C5A059] text-xs text-[#FAF7F2] px-4 py-3 rounded-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#A39E93] mb-1 font-semibold">
                  Time *
                </label>
                <select
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full bg-[#212121] border border-[#2E2E2E] focus:border-[#C5A059] text-xs text-[#FAF7F2] px-4 py-3 rounded-sm outline-none"
                >
                  <option>12:00 PM</option>
                  <option>01:00 PM</option>
                  <option>02:00 PM</option>
                  <option>05:30 PM</option>
                  <option>06:30 PM</option>
                  <option>07:00 PM</option>
                  <option>08:00 PM</option>
                  <option>09:00 PM</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#A39E93] mb-1 font-semibold">
                Number of Guests
              </label>
              <select
                name="guests"
                value={formData.guests}
                onChange={handleChange}
                className="w-full bg-[#212121] border border-[#2E2E2E] focus:border-[#C5A059] text-xs text-[#FAF7F2] px-4 py-3 rounded-sm outline-none"
              >
                <option>1 Guest</option>
                <option>2 Guests</option>
                <option>3 Guests</option>
                <option>4 Guests</option>
                <option>5-8 Guests</option>
                <option>Large Party (8+ Guests)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#A39E93] mb-1 font-semibold">
                Special Requests / Allergies
              </label>
              <textarea
                name="specialRequest"
                rows={3}
                value={formData.specialRequest}
                onChange={handleChange}
                placeholder="High chair needed, booth preference, or dietary restrictions..."
                className="w-full bg-[#212121] border border-[#2E2E2E] focus:border-[#C5A059] text-xs text-[#FAF7F2] p-4 rounded-sm outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#5C1D24] hover:bg-[#4A161D] text-[#FAF7F2] py-3.5 text-xs font-semibold tracking-widest uppercase rounded-sm border border-[#FAF7F2]/10 transition-colors shadow-lg"
            >
              REQUEST RESERVATION
            </button>
          </form>
        </div>

        {/* Policies & Info Sidebar */}
        <div className="lg:col-span-5 space-y-6 bg-[#171717] border border-[#2E2E2E] p-8 rounded-sm">
          <div className="flex items-center space-x-2 text-[#C5A059] font-serif text-lg font-semibold">
            <Info className="w-5 h-5" />
            <span>Reservation Policy</span>
          </div>

          <p className="text-xs text-[#A39E93] leading-relaxed">
            This submission is a <strong className="text-[#FAF7F2]">Reservation Request</strong>. Our host stand will verify table availability and send a confirmation via email or phone call.
          </p>

          <div className="space-y-3 pt-4 border-t border-[#2E2E2E] text-xs text-[#A39E93]">
            <p className="font-semibold text-[#FAF7F2]">Reservation Holding</p>
            <p>Tables are held for up to 15 minutes past the reserved time slot.</p>

            <p className="font-semibold text-[#FAF7F2] pt-2">Large Parties</p>
            <p>For parties exceeding 8 guests, please visit our <a href="/private-events" className="text-[#C5A059] underline">Private Events</a> page.</p>

            <p className="font-semibold text-[#FAF7F2] pt-2">Direct Phone Reservation</p>
            <p>Call us at <strong className="text-[#FAF7F2]">{RESTAURANT_INFO.phone}</strong> for immediate booking assistance.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
