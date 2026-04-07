import { useState } from 'react';
import TextField from '@/components/ui/TextField';
import CategorySelector from '@/components/features/CategorySelector';
import ImageUploader from '@/components/features/ImageUploader';
import GPSLocationTrigger from '@/components/features/GPSLocationTrigger';
import StoreHoursSelector from '@/components/features/StoreHoursSelector';

export default function IdentityStep({ formData, setFormData, dbCategories, onNextStep }) {
  // State to control the hours accordion
  const [showHours, setShowHours] = useState(false);
  
  // Callback when image successfully crops and compresses
  const handleImageSuccess = (file, previewUrl) => {
    setFormData({
      ...formData,
      storeImageFile: file,
      storeImagePreview: previewUrl
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-6">
      
      {/* SECTION 1: OWNER & STORE NAME */}
      <div className="grid grid-cols-2 gap-4">
        <TextField label="First Name" placeholder="e.g. Rahul" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
        <TextField label="Last Name" placeholder="e.g. Sharma" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
      </div>
      <TextField label="Store Name" placeholder="e.g. Sharma Kirana Store" value={formData.storeName} onChange={e => setFormData({...formData, storeName: e.target.value})} />

      {/* SECTION 2: CATEGORY LOGIC */}
      <CategorySelector 
        formData={formData} 
        setFormData={setFormData} 
        dbCategories={dbCategories} 
      />

      {/* SECTION 3: IMAGE UPLOAD & CROP */}
      <ImageUploader 
        initialPreview={formData.storeImagePreview} 
        onUploadSuccess={handleImageSuccess} 
      />

      {/* SECTION 4: STORE HOURS (OPTIONAL ACCORDION) */}
      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <button 
          type="button"
          onClick={() => setShowHours(!showHours)}
          className="w-full flex justify-between items-center p-4 bg-white hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">🕒</span>
            <span className="font-bold text-gray-800">Store Hours</span>
            <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full uppercase">Optional</span>
          </div>
          <span className={`transform transition-transform text-gray-400 ${showHours ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>

        {showHours && (
          <div className="p-4 border-t border-gray-100 bg-white animate-in slide-in-from-top-2 duration-300">
            <p className="text-xs text-gray-500 mb-4">Set your default operating hours now, or configure them later in your profile.</p>
            
            <StoreHoursSelector 
              initialHours={formData.storeHours}
              onChange={(newHours) => setFormData({ ...formData, storeHours: newHours })}
            />
          </div>
        )}
      </div>

      {/* SECTION 5: THE GPS TRIGGER */}
      <GPSLocationTrigger 
        onLocationDetected={({ lat, lng }) => {
          // Save the GPS to state
          setFormData({ ...formData, latitude: lat, longitude: lng });
          // Instantly jump to the Map screen!
          if (onNextStep) onNextStep(2); 
        }}
        onLocationFailed={() => {
          // If they deny GPS, push them to the map anyway so they can type it manually
          if (onNextStep) onNextStep(2);
        }}
      />
      
    </div>
  );
}