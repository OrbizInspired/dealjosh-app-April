export default function CategorySelector({ formData, setFormData, dbCategories }) {
  const masters = dbCategories.filter(c => c.parent_id === null);
  const subs = dbCategories.filter(c => c.parent_id === parseInt(formData.masterCategoryId));
  const selectedSubIds = formData.subCategoryIds || [];

  return (
    <>
      <div className="flex flex-col relative group">
        <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-2 tracking-widest">Primary Business Category</label>
        <select 
          className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-dj-orange focus:bg-white outline-none appearance-none transition-all text-gray-700 font-medium group-hover:border-gray-200"
          value={formData.masterCategoryId || ''}
          onChange={e => setFormData({ ...formData, masterCategoryId: e.target.value, subCategoryIds: [] })}
        >
          <option value="" disabled>Select a category...</option>
          {masters.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
        </select>
        <div className="absolute right-4 top-9.5 pointer-events-none text-gray-400 text-xs">▼</div>
      </div>

      {formData.masterCategoryId && subs.length > 0 && (
        <div className="animate-in zoom-in-95 duration-300 bg-white p-4 rounded-3xl border border-gray-50 shadow-sm">
          <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-3 block tracking-widest">Sub-Categories (Select Multiple)</label>
          <div className="relative mb-4">
            <select
              className="w-full bg-white border-2 border-dashed border-gray-200 rounded-2xl py-3 px-4 focus:border-dj-orange outline-none transition-all text-gray-500 text-sm font-bold appearance-none cursor-pointer hover:bg-gray-50"
              value="" 
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (val && !selectedSubIds.includes(val)) setFormData({ ...formData, subCategoryIds: [...selectedSubIds, val] });
              }}
            >
              <option value="" disabled>+ Add a sub-category...</option>
              {subs.filter(sub => !selectedSubIds.includes(sub.id)).map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-dj-orange text-lg font-black">+</div>
          </div>

          {selectedSubIds.length > 0 && (
            <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-2xl border border-gray-100 min-h-15 items-start shadow-inner">
              {selectedSubIds.map(id => {
                const subCat = subs.find(s => s.id === id);
                if (!subCat) return null;
                return (
                  <div key={id} className="flex items-center gap-2 bg-white text-dj-orange border border-dj-orange/30 px-3 py-1.5 rounded-full text-xs font-black shadow-sm animate-in zoom-in duration-200">
                    <span>{subCat.name}</span>
                    <button type="button" onClick={() => setFormData({ ...formData, subCategoryIds: selectedSubIds.filter(scId => scId !== id) })} className="w-5 h-5 flex items-center justify-center rounded-full bg-dj-orange/10 hover:bg-dj-red hover:text-white transition-colors focus:outline-none">✕</button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </>
  );
}