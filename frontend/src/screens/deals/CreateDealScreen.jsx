import React, { useState, useEffect } from 'react';
import { Rocket } from 'lucide-react';

// UI COMPONENTS
import AppHeader from '@/components/ui/AppHeader';
import BottomNav from '@/components/ui/BottomNav';
import TextField from '@/components/ui/TextField';
import Button from '@/components/ui/Button';

// FEATURE COMPONENTS
import ImageUploader from '@/components/features/ImageUploader';
import DynamicOfferForm from '@/components/features/DynamicOfferForm';
import DealSchedule from '@/components/features/DealSchedule';

export default function CreateDealScreen() {
  const [dealTypes, setDealTypes] = useState([]);
  const [isLoadingTypes, setIsLoadingTypes] = useState(true);

  // Time Helpers
  const getTodayDateString = () => new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().split('T')[0];
  const getCurrentTimeString = () => `${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`;
  const getTodayId = () => (new Date().getDay() + 6) % 7;

  // Orchestrator State
  const [formData, setFormData] = useState({
    productName: '', imageFile: null, imagePreview: null,
    offerType: '', offerDetails: { buyQty: '', getQty: '', discountPercent: '', flatValue: '' },
    isRecurring: false, selectedDays: [getTodayId()],       
    startDate: getTodayDateString(), endDate: getTodayDateString(),      
    useStoreHours: false, customStartTime: getCurrentTimeString(), customEndTime: '21:00'              
  });

  const updateForm = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));
  
  const toggleDay = (id) => {
    const days = formData.selectedDays.includes(id) 
      ? formData.selectedDays.filter(d => d !== id) 
      : [...formData.selectedDays, id];
    updateForm('selectedDays', days);
  };

  // Mock DB Fetch
  useEffect(() => {
    const fetchMockData = async () => {
      const mockDbResponse = [
        { id: 'BOGO', name: 'BOGO' }, 
        { id: 'Discount', name: 'Discount' }, 
        { id: 'Flat', name: 'Flat' }
      ];
      setDealTypes(mockDbResponse);
      if (mockDbResponse.length > 0) updateForm('offerType', mockDbResponse[0].id);
      setIsLoadingTypes(false);
    };
    fetchMockData();
  }, []);

  const handlePublish = async () => {
    console.log("🚀 Payload ready for Go Backend:", formData);
  };

  return (
    // THE FLEXBOX SANDWICH: Strict column, exact screen height
    <div className="bg-slate-50 max-w-md mx-auto h-dvh flex flex-col shadow-2xl relative">
      
      {/* 1. HEADER */}
      <AppHeader />

      {/* 2. SCROLLABLE CONTENT (flex-1 takes available space) */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-8">
        
        {/* COMPACT IDENTITY BLOCK (Side-by-Side!) */}
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex gap-4 items-center">
          
          {/* Small Square Image Uploader Area */}
          <div className="w-24 h-24 shrink-0">
             <ImageUploader 
               label="Photo" 
               cropAspect={1} // Forces the cropper to be a perfect 1:1 square!
               initialPreview={formData.imagePreview} 
               onUploadSuccess={(file, previewUrl) => { 
                 updateForm('imageFile', file); 
                 updateForm('imagePreview', previewUrl); 
               }} 
             />
          </div>

          {/* Product Name Input */}
          <div className="flex-1"> 
             <TextField 
               label="Product Name" 
               placeholder="e.g. Filter Coffee" 
               value={formData.productName} 
               onChange={(e) => updateForm('productName', e.target.value)} 
             />
          </div>
        </div>

        {/* DYNAMIC OFFER FORM */}
        <DynamicOfferForm 
          dealTypes={dealTypes} 
          isLoadingTypes={isLoadingTypes} 
          offerType={formData.offerType} 
          setOfferType={(val) => updateForm('offerType', val)} 
          offerDetails={formData.offerDetails} 
          setOfferDetails={(details) => updateForm('offerDetails', typeof details === 'function' ? details(formData.offerDetails) : details)} 
        />

        {/* SCHEDULE (Collapsible) */}
        <DealSchedule formData={formData} updateForm={updateForm} toggleDay={toggleDay} />

        {/* PUBLISH BUTTON */}
        <div className="pt-2">
          <Button onClick={handlePublish} variant="primary">
            <span className="flex items-center justify-center gap-2 w-full">
              PUBLISH DEAL <Rocket size={18} />
            </span>
          </Button>
        </div>

      </div>

      {/* 3. BOTTOM NAV (Naturally sits at the bottom) */}
      <BottomNav />

    </div>
  );
}