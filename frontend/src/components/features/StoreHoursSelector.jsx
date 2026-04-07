import { useState, useEffect } from 'react';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DEFAULT_HOURS = { isOpen: true, open: '10:00', close: '22:00' };

export default function StoreHoursSelector({ initialHours, onChange }) {
  const [isCustom, setIsCustom] = useState(false);
  
  // Initialize all 7 days
  const [schedule, setSchedule] = useState(() => {
    if (initialHours) return initialHours;
    const initial = {};
    DAYS.forEach(day => initial[day] = { ...DEFAULT_HOURS });
    return initial;
  });

  // Whenever local schedule changes, bubble it up to the parent
  useEffect(() => {
    onChange(schedule);
  }, [schedule]);

  // Bulk update helper (Mon-Fri or Sat-Sun)
  const handleBulkUpdate = (type, field, value) => {
    const newSchedule = { ...schedule };
    const targetDays = type === 'weekdays' ? DAYS.slice(0, 5) : DAYS.slice(5, 7);
    
    targetDays.forEach(day => {
      newSchedule[day] = { ...newSchedule[day], [field]: value };
    });
    setSchedule(newSchedule);
  };

  // Individual update helper
  const handleSingleUpdate = (day, field, value) => {
    setSchedule({
      ...schedule,
      [day]: { ...schedule[day], [field]: value }
    });
  };

  // --- UI RENDERING ---
  
  if (isCustom) {
    return (
      <div className="space-y-3">
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold text-sm text-gray-700">Custom Daily Schedule</span>
          <button onClick={() => setIsCustom(false)} className="text-xs text-blue-600 font-bold">Back to Simple</button>
        </div>
        
        {DAYS.map(day => (
          <div key={day} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-lg">
            <span className="font-semibold text-sm w-16 capitalize">{day.slice(0, 3)}</span>
            
            <button 
              onClick={() => handleSingleUpdate(day, 'isOpen', !schedule[day].isOpen)}
              className={`px-2 py-1 text-[10px] font-bold rounded-full mr-2 ${schedule[day].isOpen ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-200 text-gray-500'}`}
            >
              {schedule[day].isOpen ? 'OPEN' : 'CLOSED'}
            </button>

            {schedule[day].isOpen ? (
              <div className="flex gap-2">
                <input type="time" value={schedule[day].open} onChange={(e) => handleSingleUpdate(day, 'open', e.target.value)} className="p-1 border rounded text-xs bg-white" />
                <span className="text-gray-400">-</span>
                <input type="time" value={schedule[day].close} onChange={(e) => handleSingleUpdate(day, 'close', e.target.value)} className="p-1 border rounded text-xs bg-white" />
              </div>
            ) : (
              <div className="flex-1 text-right text-xs text-gray-400 italic">Closed all day</div>
            )}
          </div>
        ))}
      </div>
    );
  }

  // DEFAULT 2-BLOCK VIEW
  return (
    <div className="space-y-4 rounded-xl">
      {/* Weekdays */}
      <div className="border border-gray-100 p-4 rounded-lg bg-gray-50">
        <div className="flex justify-between items-center mb-3">
          <span className="font-bold text-sm text-gray-700">Mon - Fri</span>
          <button onClick={() => handleBulkUpdate('weekdays', 'isOpen', !schedule.monday.isOpen)} className={`px-3 py-1 text-xs font-bold rounded-full ${schedule.monday.isOpen ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-200 text-gray-500'}`}>
            {schedule.monday.isOpen ? 'Open' : 'Closed'}
          </button>
        </div>
        {schedule.monday.isOpen && (
          <div className="flex gap-4">
            <input type="time" value={schedule.monday.open} onChange={(e) => handleBulkUpdate('weekdays', 'open', e.target.value)} className="flex-1 p-2 border rounded text-sm bg-white" />
            <input type="time" value={schedule.monday.close} onChange={(e) => handleBulkUpdate('weekdays', 'close', e.target.value)} className="flex-1 p-2 border rounded text-sm bg-white" />
          </div>
        )}
      </div>

      {/* Weekends */}
      <div className="border border-gray-100 p-4 rounded-lg bg-gray-50">
        <div className="flex justify-between items-center mb-3">
          <span className="font-bold text-sm text-gray-700">Sat - Sun</span>
          <button onClick={() => handleBulkUpdate('weekends', 'isOpen', !schedule.saturday.isOpen)} className={`px-3 py-1 text-xs font-bold rounded-full ${schedule.saturday.isOpen ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-200 text-gray-500'}`}>
            {schedule.saturday.isOpen ? 'Open' : 'Closed'}
          </button>
        </div>
        {schedule.saturday.isOpen && (
          <div className="flex gap-4">
            <input type="time" value={schedule.saturday.open} onChange={(e) => handleBulkUpdate('weekends', 'open', e.target.value)} className="flex-1 p-2 border rounded text-sm bg-white" />
            <input type="time" value={schedule.saturday.close} onChange={(e) => handleBulkUpdate('weekends', 'close', e.target.value)} className="flex-1 p-2 border rounded text-sm bg-white" />
          </div>
        )}
      </div>

      <button 
        onClick={() => setIsCustom(true)}
        className="w-full py-2 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        ⚙️ Customize Daily Hours
      </button>
    </div>
  );
}