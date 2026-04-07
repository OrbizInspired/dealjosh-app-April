import React from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DealDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="w-16 h-16 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-sm font-bold text-xl">
        DJ
      </div>
      <h1 className="text-2xl font-black text-slate-800 mb-2">Merchant Dashboard</h1>
      <p className="text-slate-500 mb-8 text-center text-sm font-medium">Your active deals and analytics will appear here.</p>
      
      <button 
        onClick={() => navigate('/post-deal')}
        className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded-full shadow-[0_8px_20px_rgba(234,88,12,0.3)] flex items-center gap-2 transition-transform active:scale-95"
      >
        <Plus size={20} strokeWidth={3} />
        <span>Create First Deal</span>
      </button>
    </div>
  );
}