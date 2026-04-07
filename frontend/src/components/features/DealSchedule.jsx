import React, { useState } from 'react';
import { Calendar, Clock, ChevronDown, ChevronUp } from 'lucide-react';

const DAYS = [{ id: 0, l: 'M' }, { id: 1, l: 'T' }, { id: 2, l: 'W' }, { id: 3, l: 'T' }, { id: 4, l: 'F' }, { id: 5, l: 'S' }, { id: 6, l: 'S' }];

export default function DealSchedule({ formData, updateForm, toggleDay }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
      
      {/* HEADER (Clickable to expand/collapse) */}
      <div className="flex items-center justify-between cursor-pointer select-none" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-slate-700" />
          <h2 className="font-bold text-slate-800">Schedule</h2>
        </div>
        {isExpanded ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
      </div>

      {/* COLLAPSIBLE CONTENT */}
      {isExpanded && (
        <div className="pt-5 mt-4 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
          
          {/* 👇 RECURRING TOGGLE MOVED HERE */}
          <div className="flex items-center justify-between mb-5 bg-slate-50 p-3 rounded-2xl">
             <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Set as Recurring</span>
             <button onClick={() => updateForm('isRecurring', !formData.isRecurring)} className={`w-9 h-5 rounded-full p-0.5 transition-colors shadow-inner ${formData.isRecurring ? 'bg-dj-orange' : 'bg-slate-300'}`}>
               <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${formData.isRecurring ? 'translate-x-4' : 'translate-x-0'}`} />
             </button>
          </div>

          <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-2 block">Valid Days</label>
          <div className="flex justify-between mb-5">
            {DAYS.map((day) => (
              <button key={day.id} onClick={() => toggleDay(day.id)} className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${formData.selectedDays.includes(day.id) ? 'bg-slate-800 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-500'}`}>
                {day.l}
              </button>
            ))}
          </div>

          <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-2 block">Valid Dates</label>
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
              <span className="text-[9px] font-bold text-dj-orange block mb-0.5 uppercase">Start</span>
              <input type="date" value={formData.startDate} onChange={(e) => updateForm('startDate', e.target.value)} className="bg-transparent w-full text-xs font-bold text-slate-700 outline-none cursor-pointer" />
            </div>
            <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
              <span className="text-[9px] font-bold text-dj-orange block mb-0.5 uppercase">End</span>
              <input type="date" value={formData.endDate} onChange={(e) => updateForm('endDate', e.target.value)} className="bg-transparent w-full text-xs font-bold text-slate-700 outline-none cursor-pointer" />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <div className="flex items-center justify-between mb-3">
               <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Valid Hours</label>
               <div className="flex items-center gap-2">
                 <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Use Store Hours</span>
                 <button onClick={() => updateForm('useStoreHours', !formData.useStoreHours)} className={`w-8 h-4 rounded-full p-0.5 transition-colors shadow-inner ${formData.useStoreHours ? 'bg-dj-orange' : 'bg-slate-300'}`}>
                  <div className={`w-3 h-3 bg-white rounded-full shadow-sm transform transition-transform ${formData.useStoreHours ? 'translate-x-4' : 'translate-x-0'}`} />
                 </button>
               </div>
            </div>

            {formData.useStoreHours ? (
              <div className="bg-orange-50 border border-orange-100 p-2.5 rounded-xl flex items-center gap-2 text-dj-orange animate-in fade-in">
                <Clock size={14} />
                <span className="text-[11px] font-bold">Active during regular shop hours.</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-1">
                <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                  <span className="text-[9px] font-bold text-dj-orange block mb-0.5 uppercase">Start Time</span>
                  <input type="time" value={formData.customStartTime} onChange={(e) => updateForm('customStartTime', e.target.value)} className="bg-transparent w-full text-xs font-bold text-slate-700 outline-none cursor-pointer" />
                </div>
                <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                  <span className="text-[9px] font-bold text-dj-orange block mb-0.5 uppercase">End Time</span>
                  <input type="time" value={formData.customEndTime} onChange={(e) => updateForm('customEndTime', e.target.value)} className="bg-transparent w-full text-xs font-bold text-slate-700 outline-none cursor-pointer" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}