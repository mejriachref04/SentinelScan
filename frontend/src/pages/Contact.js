import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, Check } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Header Banner */}
      <div className="relative py-20 px-6 rounded-sm bg-[#171717] border border-[#2E2E2E] text-center space-y-4 shadow-xl">
        <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-bold">
          GET IN TOUCH
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl text-[#FAF7F2] font-bold">
          CONTACT US
        </h1>
        <p className="text-xs sm:text-sm text-[#A39E93] max-w-xl mx-auto leading-relaxed">
          We welcome your inquiries, feedback, and reservations. Reach out to our team or visit us in person.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Contact Info Sidebar */}
        <div className="lg:col-span-5 space-y-8 bg-[#171717] border border-[#2E2E2E] p-8 rounded-sm">
          <div className="space-y-3">
            <h2 className="font-serif text-2xl text-[#FAF7F2] font-bold">
              {RESTAURANT_INFO.name}
            </h2>
            <p className="text-xs text-[#A39E93] leading-relaxed">
              Experience the true spirit of Indian hospitality.
            </p>
          </div>

          <div className="space-y-4 text-xs text-[#ECE6DA] border-t border-[#2E2E2E] pt-6">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[#FAF7F2]">Address</p>
                <p className="text-[#A39E93]">{RESTAURANT_INFO.address}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Phone className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[#FAF7F2]">Phone</p>
                <p className="text-[#A39E93]">{RESTAURANT_INFO.phone}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[#FAF7F2]">Email</p>
                <p className="text-[#A39E93]">{RESTAURANT_INFO.email}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[#FAF7F2]">Hours</p>
                <p className="text-[#A39E93]">Mon - Fri: {RESTAURANT_INFO.hours.weekdays}</p>
                <p className="text-[#A39E93]">Sat - Sun: {RESTAURANT_INFO.hours.weekends}</p>
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <a
              href={`tel:${RESTAURANT_INFO.phone}`}
              className="flex-1 bg-[#5C1D24] hover:bg-[#4A161D] text-[#FAF7F2] text-center py-2.5 text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors"
            >
              CALL RESTAURANT
            </a>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(RESTAURANT_INFO.address)}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 bg-[#212121] hover:bg-[#C5A059] text-[#FAF7F2] hover:text-[#0D0D0D] border border-[#2E2E2E] text-center py-2.5 text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors"
            >
              GET DIRECTIONS
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-[#171717] border border-[#2E2E2E] p-8 sm:p-10 rounded-sm">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <Check className="w-12 h-12 text-[#C5A059] mx-auto bg-[#C5A059]/10 p-2.5 rounded-full border border-[#C5A059]/30" />
              <h3 className="font-serif text-3xl text-[#FAF7F2] font-bold">
                Message Sent Successfully
              </h3>
              <p className="text-xs text-[#A39E93]">
                Thank you for contacting KAITIND RESTAURANT. We will respond promptly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="font-serif text-2xl text-[#FAF7F2] font-bold mb-4">
                SEND US A MESSAGE
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#A39E93] mb-1 font-semibold">
                    Your Name *
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

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#A39E93] mb-1 font-semibold">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(555) 000-0000"
                  className="w-full bg-[#212121] border border-[#2E2E2E] focus:border-[#C5A059] text-xs text-[#FAF7F2] px-4 py-3 rounded-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#A39E93] mb-1 font-semibold">
                  Message *
                </label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can we assist you today?"
                  className="w-full bg-[#212121] border border-[#2E2E2E] focus:border-[#C5A059] text-xs text-[#FAF7F2] p-4 rounded-sm outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#5C1D24] hover:bg-[#4A161D] text-[#FAF7F2] py-3.5 text-xs font-semibold tracking-widest uppercase rounded-sm border border-[#FAF7F2]/10 transition-colors shadow-lg flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4 text-[#C5A059]" />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
