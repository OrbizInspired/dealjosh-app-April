import React from 'react';
import { Percent, Banknote, ChevronDown, Tag } from 'lucide-react';

export default function DynamicOfferForm({ 
  dealTypes, 
  isLoadingTypes, 
  offerType, 
  setOfferType, 
  offerDetails, 
  setOfferDetails 
}) {
  const handleDetailChange = (field, value) => {
    setOfferDetails(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
      
      {/* 1. SECTION HEADER */}
      <div className="flex items-center gap-2 mb-4">
        <Tag size={18} className="text-slate-700" />
        <h2 className="font-bold text-slate-800">Offer Type</h2>
      </div>

      {/* 2. THE DB-DRIVEN DROPDOWN */}
      {isLoadingTypes ? (
         <div className="h-12 bg-slate-100 rounded-xl animate-pulse mb-6 w-full"></div>
      ) : (
        <div className="relative mb-6">
          <select
            value={offerType}
            onChange={(e) => setOfferType(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-800 text-sm font-bold focus:ring-2 focus:ring-orange-400 outline-none appearance-none cursor-pointer"
          >
            {dealTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name} Deal
              </option>
            ))}
          </select>
          <ChevronDown size={18} className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" />
        </div>
      )}

      {/* 3. THE DYNAMIC INPUTS */}
      {offerType && (
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
          
          {offerType === 'BOGO' && (
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Buy Quantity</label>
                <input type="number" placeholder="e.g. 2" className="w-full p-2 rounded-lg border border-slate-200 outline-none focus:border-orange-400 text-sm font-bold"
                  value={offerDetails.buyQty} onChange={(e) => handleDetailChange('buyQty', e.target.value)} />
              </div>
              <span className="font-black text-slate-300 mt-5">+</span>
              <div className="flex-1">
                <label className="text-[10px] font-bold text-orange-600 uppercase block mb-1">Get Free</label>
                <input type="number" placeholder="e.g. 1" className="w-full p-2 rounded-lg border border-slate-200 outline-none focus:border-orange-400 text-sm font-bold"
                  value={offerDetails.getQty} onChange={(e) => handleDetailChange('getQty', e.target.value)} />
              </div>
            </div>
          )}

          {offerType === 'Discount' && (
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Discount Percentage (%)</label>
              <div className="relative">
                <input type="number" placeholder="e.g. 25" className="w-full p-3 rounded-lg border border-slate-200 outline-none focus:border-orange-400 font-bold pl-10"
                  value={offerDetails.discountPercent} onChange={(e) => handleDetailChange('discountPercent', e.target.value)} />
                <Percent size={16} className="absolute left-3 top-3.5 text-slate-400" />
              </div>
            </div>
          )}

          {offerType === 'Flat' && (
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Flat Discount Amount (₹)</label>
              <div className="relative">
                <input type="number" placeholder="e.g. 150.50" step="0.01" className="w-full p-3 rounded-lg border border-slate-200 outline-none focus:border-orange-400 font-bold pl-10"
                  value={offerDetails.flatValue} onChange={(e) => handleDetailChange('flatValue', e.target.value)} />
                <Banknote size={16} className="absolute left-3 top-3.5 text-slate-400" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}