import React from 'react';
import { LayoutDashboard, Plus, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    // Pure, simple div. No positioning hacks.
    <div className="w-full bg-white border-t border-slate-100 flex justify-between items-center h-20 px-8 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
      
      <button onClick={() => navigate('/dashboard')} className={`flex flex-col items-center gap-1 transition-opacity ${isActive('/dashboard') ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}>
        <LayoutDashboard size={22} className={isActive('/dashboard') ? 'text-dj-orange' : 'text-slate-800'} />
        <span className={`text-[9px] font-bold tracking-wider ${isActive('/dashboard') ? 'text-dj-orange' : 'text-slate-600'}`}>DASHBOARD</span>
      </button>

      <div className="relative -top-6">
        <button onClick={() => navigate('/post-deal')} className={`w-16 h-16 rounded-[20px] flex items-center justify-center text-white shadow-xl border-[6px] border-slate-50 transition-transform ${isActive('/post-deal') ? 'bg-orange-800 scale-105' : 'bg-dj-orange hover:scale-105'}`}>
          <Plus size={28} strokeWidth={3} />
        </button>
        <span className="absolute -bottom-5 left-0 w-full text-center text-[10px] font-black text-dj-orange tracking-widest uppercase">Post</span>
      </div>

      <button onClick={() => navigate('/account')} className={`flex flex-col items-center gap-1 transition-opacity ${isActive('/account') ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}>
        <User size={22} className={isActive('/account') ? 'text-dj-orange' : 'text-slate-800'} />
        <span className={`text-[9px] font-bold tracking-wider ${isActive('/account') ? 'text-dj-orange' : 'text-slate-600'}`}>ACCOUNT</span>
      </button>

    </div>
  );
}