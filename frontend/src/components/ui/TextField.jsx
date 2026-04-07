// File: frontend/src/components/TextField.jsx
export default function TextField({ label, prefix, ...props }) {
  return (
   <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
      {label && (
        <label className="block text-[10px] font-black text-gray-400 uppercase ml-2 mb-2 tracking-widest">
          {label}
        </label>
      )}
      <div className="relative flex items-center group">
        {prefix && (
          <div className="absolute left-4 flex items-center gap-2 text-dj-orange font-bold border-r pr-3 border-gray-200 h-6">
            {/* ADDING THE FLAG BACK HERE */}
            <span className="text-lg leading-none">🇮🇳</span> 
            <span>{prefix}</span>
          </div>
        )}
        <input 
          className={`w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-4 ${
            prefix ? 'pl-24' : 'pl-6'
          } focus:border-dj-orange focus:bg-white outline-none transition-all text-gray-700 font-medium placeholder:text-gray-300 shadow-sm group-hover:border-gray-200`}
          {...props} 
        />
      </div>
    </div>
  );
}