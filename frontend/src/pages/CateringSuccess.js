import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Home as HomeIcon, Utensils } from 'lucide-react';

export default function CateringSuccess() {
  const location = useLocation();
  const data = location.state || {
    name: 'Valued Client',
    email: '[CLIENT EMAIL]',
    phone: '[CLIENT PHONE]',
    eventDate: 'Selected Date',
    eventType: 'Event',
    guestCount: 'Selected Guest Count',
  };

  return (
    <div className="max-w-xl mx-auto my-16 bg-[#171717] border border-[#2E2E2E] rounded-sm p-8 sm:p-12 text-center space-y-6 shadow-2xl">
      <CheckCircle className="w-16 h-16 text-[#C5A059] mx-auto bg-[#C5A059]/10 p-3 rounded-full border border-[#C5A059]/30" />

      <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-bold block">
        CATERING INQUIRY CONFIRMATION
      </span>

      <h1 className="font-serif text-3xl sm:text-4xl text-[#FAF7F2] font-bold">
        Catering Request Received
      </h1>

      <p className="text-xs sm:text-sm text-[#A39E93] leading-relaxed">
        Thank you, <strong className="text-[#FAF7F2]">{data.name}</strong>. Our dedicated catering manager has received your inquiry for <strong className="text-[#FAF7F2]">{data.eventType}</strong> on <strong className="text-[#FAF7F2]">{data.eventDate}</strong>.
      </p>

      <div className="bg-[#212121] p-6 rounded-sm border border-[#2E2E2E] text-left text-xs space-y-2 text-[#ECE6DA]">
        <p><strong className="text-[#A39E93]">Estimated Guest Count:</strong> {data.guestCount}</p>
        <p><strong className="text-[#A39E93]">Contact Phone:</strong> {data.phone}</p>
        <p><strong className="text-[#A39E93]">Email Address:</strong> {data.email}</p>
      </div>

      <p className="text-xs text-[#A39E93]">
        Our team will contact you within 24 business hours to finalize menu selections and pricing.
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
          <span>Explore Menu</span>
        </Link>
      </div>
    </div>
  );
}
