import React from 'react';

export default function BrandHeader({ title, subtitle }) {
  return (
    <div className="flex flex-col items-center text-center space-y-4 pt-4">
      {/* The DealJosh Logo Bag */}
      <div className="relative w-20 h-20 mb-2 animate-in zoom-in duration-700">
        <div className="absolute inset-0 bg-dj-yellow rounded-2xl rotate-3 shadow-sm"></div>
        <div className="absolute inset-0 bg-white border-2 border-dj-orange rounded-2xl flex items-center justify-center -rotate-3 transition-transform hover:rotate-0 duration-300">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black text-dj-orange leading-none">DJ</span>
            <span className="text-2xl">₹</span>
          </div>
        </div>
        {/* Bag Handle */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-6 border-t-4 border-l-4 border-r-4 border-dj-orange rounded-t-full"></div>
      </div>

      {/* Main Title */}
      <h1 className="text-3xl font-black text-dj-orange tracking-tighter uppercase italic">
        {title || "Merchant Login"}
      </h1>

      {/* The New Shortened Slogan with Alternate Colors */}
      <div className="space-y-1">
        <p className="text-xl font-bold leading-tight tracking-tight">
          <span className="text-gray-800">ज़्यादा सौदे, </span>
          <span className="text-dj-red italic underline decoration-dj-yellow decoration-4 underline-offset-4">
            ज़्यादा मुनाफा
          </span>
        </p>
        
        {/* Dynamic Subtitle */}
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">
          {subtitle || "Grow your business with DealJosh"}
        </p>
      </div>
    </div>
  );
}