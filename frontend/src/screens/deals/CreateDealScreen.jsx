// dealjosh-merchant/frontend/src/screens/deals/CreateDealScreen.jsx
import React, { useState, useEffect } from 'react';
import { Rocket, Sparkles, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  const [dealTypes, setDealTypes] = useState([]);
  const [isLoadingTypes, setIsLoadingTypes] = useState(true);

  // 🚀 AI & Network States
  const [isDrafting, setIsDrafting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Time Helpers
  const getTodayDateString = () => new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().split('T')[0];
  const getCurrentTimeString = () => `${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`;
  const getTodayId = () => (new Date().getDay() + 6) % 7;

  // Orchestrator State
  const [formData, setFormData] = useState({
    dealId: null, // Tracks the Postgres draft ID
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

  // 🚀 The Agentic Pipeline Trigger
  const draftDealWithAI = async (file) => {
    setIsDrafting(true);
    try {
      const payload = new FormData();
      payload.append('image', file);

      // 🌐 USING VITE ENV VARIABLE
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/deals/agentic`, {
        method: 'POST',
        body: payload,
      });

      if (!response.ok) throw new Error('AI drafting failed');

      const aiDraft = await response.json();
      console.log("🤖 AI Drafted Deal:", aiDraft);

      // Auto-fill the form and save the ID!
      setFormData(prev => ({
        ...prev,
        dealId: aiDraft.id,         // Save the UUID from Postgres
        productName: aiDraft.title, // Populate the Text Field
      }));

    } catch (error) {
      console.error("Agentic flow error:", error);
      alert("Failed to analyze image. You can still enter details manually.");
    } finally {
      setIsDrafting(false);
    }
  };

  // 🚀 Final Publish Logic
  const handlePublish = async () => {
    if (!formData.productName) {
      alert("Please enter a product name.");
      return;
    }

    setIsPublishing(true);
    try {
      // 1. Format the data for our Go backend
      const payload = {
        id: formData.dealId,
        title: formData.productName,
        description: formData.description || "",     // 🚀 Capture manual description
        suggested_price: Number(formData.price) || 0, // 🚀 Capture manual price
        image_url: formData.imageUrl || "",          // 🚀 Capture image if available
        offer_type: formData.offerType,
        offer_details: formData.offerDetails,
        is_recurring: formData.isRecurring,
        selected_days: formData.selectedDays,
        start_date: formData.startDate,
        end_date: formData.endDate,
        status: "live"
      };
      console.log("🚀 Publishing Deal:", payload);

      // 2. Send to Go backend using VITE ENV VARIABLE
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/deals/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to publish deal');

      // 3. 🚀 CRITICAL FIX: Parse the response to get the exact ID from PostgreSQL
      const responseData = await response.json();

      alert("🎉 Deal Published Successfully!");

      // 4. Navigate using the guaranteed ID from the server response
      navigate(`/manage-deal/${responseData.id}`);

    } catch (error) {
      console.error("Publish error:", error);
      alert("Something went wrong publishing the deal.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="bg-slate-50 max-w-md mx-auto h-dvh flex flex-col shadow-2xl relative overflow-hidden">
      <AppHeader />

      {/* SCROLLABLE AREA - removed the publish button from here */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-6">

        {/* COMPACT IDENTITY BLOCK */}
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex gap-4 items-center relative">

          {/* AI Loading Overlay */}
          {isDrafting && (
            <div className="absolute inset-0 bg-white/80 rounded-3xl z-10 flex flex-col items-center justify-center backdrop-blur-sm transition-all">
              <Loader2 className="animate-spin text-orange-500 mb-2" size={24} />
              <span className="text-sm font-medium text-slate-600 flex items-center gap-1">
                <Sparkles size={16} className="text-amber-400" /> AI is drafting...
              </span>
            </div>
          )}

          <div className="w-24 h-24 shrink-0">
            <ImageUploader
              label="Photo"
              cropAspect={1}
              initialPreview={formData.imagePreview}
              onUploadSuccess={(file, previewUrl) => {
                updateForm('imageFile', file);
                updateForm('imagePreview', previewUrl);
                draftDealWithAI(file);
              }}
            />
          </div>

          <div className="flex-1">
            <TextField
              label="Product Name"
              placeholder="e.g. Filter Coffee"
              value={formData.productName}
              onChange={(e) => updateForm('productName', e.target.value)}
            />
            {formData.productName && !isDrafting && formData.dealId && (
              <span className="text-xs text-green-600 font-medium ml-1 flex items-center gap-1 mt-1">
                <Sparkles size={12} /> Auto-filled
              </span>
            )}
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

      </div>

      {/* 🚀 STICKY PUBLISH BUTTON AREA */}
      <div className="bg-white px-4 py-3 border-t border-slate-100 shadow-[0_-8px_15px_-3px_rgba(0,0,0,0.05)] z-20 shrink-0">
        <Button onClick={handlePublish} variant="primary" disabled={isPublishing || isDrafting}>
          <span className="flex items-center justify-center gap-2 w-full">
            {isPublishing ? "PUBLISHING..." : "PUBLISH DEAL"}
            {isPublishing ? <Loader2 className="animate-spin" size={18} /> : <Rocket size={18} />}
          </span>
        </Button>
      </div>

      {/* BOTTOM NAV */}
      <BottomNav />
    </div>
  );
}