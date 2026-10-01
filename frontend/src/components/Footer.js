import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';

export default function Footer() {
  return (
    <footer className="bg-[#171717] border-t border-[#2E2E2E] text-[#ECE6DA] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#2E2E2E]">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-serif text-2xl font-bold tracking-widest text-[#FAF7F2]">
                {RESTAURANT_INFO.name}
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-[#A39E93]">
              Authentic Indian cuisine crafted with tradition, fresh spices, and culinary passion. Experience unforgettable dining, catering, and private events.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a
                href={RESTAURANT_INFO.social.instagram}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-[#212121] hover:bg-[#C5A059] text-[#ECE6DA] hover:text-[#0D0D0D] transition-colors rounded-sm"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={RESTAURANT_INFO.social.facebook}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-[#212121] hover:bg-[#C5A059] text-[#ECE6DA] hover:text-[#0D0D0D] transition-colors rounded-sm"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-base tracking-widest text-[#FAF7F2] uppercase mb-4 font-semibold border-b border-[#2E2E2E] pb-2 inline-block">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-[#A39E93]">
              {['Home', 'Menu', 'About', 'Catering', 'Private Events', 'Gallery', 'Reservations', 'Contact'].map((item) => {
                const path = item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`;
                return (
                  <li key={item}>
                    <Link to={path} className="hover:text-[#C5A059] transition-colors tracking-wider">
                      {item}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Operating Hours */}
          <div>
            <h4 className="font-serif text-base tracking-widest text-[#FAF7F2] uppercase mb-4 font-semibold border-b border-[#2E2E2E] pb-2 inline-block">
              Hours
            </h4>
            <div className="space-y-3 text-xs text-[#A39E93]">
              <div className="flex items-start space-x-2">
                <Clock className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-[#FAF7F2]">Mon – Fri</p>
                  <p>{RESTAURANT_INFO.hours.weekdays}</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Clock className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-[#FAF7F2]">Sat – Sun</p>
                  <p>{RESTAURANT_INFO.hours.weekends}</p>
                </div>
              </div>
              <div className="text-[11px] text-[#C5A059] pt-1">
                Lunch Buffet: {RESTAURANT_INFO.hours.lunchBuffet}
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-serif text-base tracking-widest text-[#FAF7F2] uppercase mb-4 font-semibold border-b border-[#2E2E2E] pb-2 inline-block">
              Location & Contact
            </h4>
            <ul className="space-y-3 text-xs text-[#A39E93]">
              <li className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <span>{RESTAURANT_INFO.address}</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>{RESTAURANT_INFO.phone}</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>{RESTAURANT_INFO.email}</span>
              </li>
            </ul>
            <div className="pt-4">
              <Link
                to="/reservations"
                className="inline-block text-xs uppercase tracking-widest bg-[#212121] hover:bg-[#C5A059] text-[#ECE6DA] hover:text-[#0D0D0D] px-4 py-2 border border-[#2E2E2E] transition-all font-semibold rounded-sm"
              >
                Book A Table
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Legal bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-[#A39E93] gap-4">
          <p>© {new Date().getFullYear()} {RESTAURANT_INFO.name}. All Rights Reserved.</p>
          <div className="flex items-center space-x-6">
            <span className="hover:text-[#FAF7F2] cursor-pointer">Privacy Policy</span>
            <span className="hover:text-[#FAF7F2] cursor-pointer">Terms of Service</span>
            <span className="hover:text-[#FAF7F2] cursor-pointer">Accessibility</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
