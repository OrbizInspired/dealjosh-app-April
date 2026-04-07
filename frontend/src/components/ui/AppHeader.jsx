import React from 'react';

export default function AppHeader() {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-100 shadow-sm w-full">
      
      {/* 1. Sleek DJ Badge & Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-8 bg-white border-2 border-dj-orange rounded-md flex items-center justify-center shadow-sm">
          <span className="text-sm font-black text-dj-orange">DJ</span>
        </div>
        <h1 className="text-xl font-black text-slate-800 tracking-tight italic">DealJosh</h1>
      </div>

      {/* 2. Profile & Subscription */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-end">
           <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Standard</span>
           <button className="text-[10px] font-black text-dj-orange hover:text-orange-700 transition-colors">UPGRADE</button>
        </div>
        <div className="relative cursor-pointer hover:opacity-80 transition-opacity">
          <img src="https://ui-avatars.com/api/?name=DJ&background=CC5500&color=fff" alt="Profile" className="w-10 h-10 rounded-full border-2 border-slate-100 shadow-sm object-cover" />
        </div>
      </div>
    </div>
  );
}