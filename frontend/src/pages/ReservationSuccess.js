import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, Users, Home as HomeIcon, Utensils } from 'lucide-react';

export default function ReservationSuccess() {
  const location = useLocation();
  const data = location.state || {
    name: 'Valued Guest',
    email: '[GUEST EMAIL]',
    phone: '[GUEST PHONE]',
    date: 'Selected Date',
    time: 'Selected Time',
    guests: 'Selected Party Size',
    specialRequest: 'None',
  };

  return (
    <div className="max-w-xl mx-auto my-16 bg-[#171717] border border-[#2E2E2E] rounded-sm p-8 sm:p-12 text-center space-y-6 shadow-2xl">
      <CheckCircle className="w-16 h-16 text-[#C5A059] mx-auto bg-[#C5A059]/10 p-3 rounded-full border border-[#C5A059]/30" />

      <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-bold block">
        RESERVATION REQUEST SUBMITTED
      </span>

      <h1 className="font-serif text-3xl sm:text-4xl text-[#FAF7F2] font-bold">
        We Look Forward to Welcoming You
      </h1>

      <p className="text-xs sm:text-sm text-[#A39E93] leading-relaxed">
        Thank you, <strong className="text-[#FAF7F2]">{data.name}</strong>. Your reservation request has been transmitted to our host team.
      </p>

      {/* Reservation Summary Details */}
      <div className="bg-[#212121] p-6 rounded-sm border border-[#2E2E2E] text-left text-xs space-y-3">
        <h4 className="font-serif text-base text-[#FAF7F2] font-semibold border-b border-[#2E2E2E] pb-2">
          Request Summary
        </h4>

        <div className="grid grid-cols-2 gap-3 text-[#ECE6DA]">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-[#C5A059]" />
            <span>Date: {data.date}</span>
          </div>

          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-[#C5A059]" />
            <span>Time: {data.time}</span>
          </div>

          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-[#C5A059]" />
            <span>Party Size: {data.guests}</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[#A39E93]">Phone:</span>
            <span>{data.phone}</span>
          </div>
        </div>

        {data.specialRequest && data.specialRequest !== 'None' && (
          <div className="pt-2 border-t border-[#2E2E2E] text-[#A39E93]">
            <strong className="text-[#FAF7F2]">Special Requests:</strong> {data.specialRequest}
          </div>
        )}
      </div>

      <div className="p-4 bg-[#212121]/50 border border-[#2E2E2E] text-left text-[11px] text-[#A39E93]">
        <p className="font-semibold text-[#C5A059] mb-1">Status: Request Pending Host Confirmation</p>
        <p>Our dining coordinator will send an email or SMS confirmation to <strong>{data.email}</strong> once your table is reserved.</p>
      </div>

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
          <span>View Menu</span>
        </Link>
      </div>
    </div>
  );
}
