export default function AddressDetailsCard({ formData, isLoading }) {
  return (
    <div className="bg-[#F8F9ED] rounded-3xl p-5 shadow-lg border border-gray-200/50 relative overflow-hidden">
      
      {isLoading && (
         <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-20 flex items-center justify-center">
            <span className="animate-pulse text-dj-orange font-bold text-sm tracking-widest uppercase">Resolving...</span>
         </div>
      )}

      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-dj-orange/10 flex items-center justify-center text-dj-orange border border-dj-orange/20">
            ⌖
          </div>
          <h3 className="font-black text-gray-800 text-lg">Resolved Address</h3>
        </div>
        <button className="text-dj-orange text-xs font-bold tracking-widest uppercase hover:underline">
          Edit
        </button>
      </div>

      <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
        <div>
          <p className="text-[10px] font-bold text-[#8A9AB0] uppercase tracking-widest">Shop/Unit No.</p>
          <p className="font-medium text-gray-800">{formData.shopAddress?.split(',')[0] || '...'}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-[#8A9AB0] uppercase tracking-widest">Street Name</p>
          <p className="font-medium text-gray-800 truncate">{formData.shopAddress || '...'}</p>
        </div>
        <div className="col-span-2">
          <p className="text-[10px] font-bold text-[#8A9AB0] uppercase tracking-widest">Landmark</p>
          <p className="font-medium text-gray-800">{formData.landmark || '...'}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-[#8A9AB0] uppercase tracking-widest">City</p>
          <p className="font-medium text-gray-800">{formData.city || '...'}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-[#8A9AB0] uppercase tracking-widest">State</p>
          <p className="font-medium text-gray-800">{formData.state || '...'}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-[#8A9AB0] uppercase tracking-widest">Pin Code</p>
          <p className="font-medium text-gray-800">{formData.pinCode || '...'}</p>
        </div>
      </div>
    </div>
  );
}