import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BrandHeader from '@/components/ui/BrandHeader';
import Button from '@/components/ui/Button';
import Stepper from '@/components/ui/Stepper';
import IdentityStep from './Registration/IdentityStep';
import LocationStep from './Registration/LocationStep';

// Define steps here so they are easily updatable in ONE place
const REGISTRATION_STEPS = [
  { id: 1, title: 'Business Identity', icon: '👤' },
  { id: 2, title: 'Store Location', icon: '🏪' },
  { id: 3, title: 'Final Review', icon: '🚀' }
];

export default function StoreRegistrationScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // 1. STATE MANAGEMENT
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  
  // Expanded Master Data Object capturing Identity & Location
  const [formData, setFormData] = useState({
    mobileNumber: location.state?.mobileNumber || '',
    firstName: '',
    lastName: '',
    storeName: '',
    masterCategoryId: '',
    subCategoryIds: [],
    storeImageFile: null,
    storeImagePreview: null,
    // Step 2 Fields (Aligned with our Geocoding Brain)
    latitude: null,
    longitude: null,
    shopAddress: '',
    landmark: '',
    city: '',
    state: '',
    pinCode: '',
    storeHours: null
  });

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // 2. FETCH CATEGORIES ON LOAD
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/categories`)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error("Category fetch failed:", err));
  }, [API_BASE_URL]);

  // 3. NAVIGATION LOGIC
  const handleNext = () => {
    if (step === 1) {
      // Validate Step 1 before moving manually (if they didn't use the GPS button)
      if (!formData.firstName || !formData.storeName || !formData.masterCategoryId) {
        setError("Please fill all mandatory fields.");
        return;
      }
      setError('');
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else {
      submitToBackend();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  // 4. THE BRAIN: FINAL API CALL
  const submitToBackend = async () => {
    setLoading(true);
    const token = localStorage.getItem('dealjosh_token');
    
    // Note: Once the Go backend is ready, this will be upgraded to a FormData payload
    // to handle the storeImageFile upload. For now, it mocks the JSON post.
    try {
      const response = await fetch(`${API_BASE_URL}/api/merchants/register-store`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        navigate('/dashboard');
      } else {
        setError("Something went wrong on the server.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col pt-4">
      
      {/* HEADER & STEPPER - Hidden on Step 2 because the Map acts as a full-screen native view */}
      {step !== 2 && (
        <>
          <div className="px-2">
            <BrandHeader 
              title="Store Setup" 
              subtitle={`Registering with ${formData.mobileNumber}`} 
            />
          </div>

          <Stepper currentStep={step} steps={REGISTRATION_STEPS} />
        </>
      )}

      {/* STEP CONTENT AREA */}
      <div className={`flex-1 overflow-y-auto custom-scrollbar ${step !== 2 ? 'px-2' : ''}`}>
        {error && (
          <p className="text-dj-red text-[10px] font-bold text-center mb-4 bg-red-50 p-2 rounded-lg mx-2">
            {error}
          </p>
        )}
        
        {step === 1 && (
          <IdentityStep 
            formData={formData} 
            setFormData={setFormData} 
            dbCategories={categories} 
            onNextStep={setStep} // Enables the GPS Location Button to jump to Map Step
          />
        )}

        {step === 2 && (
          <LocationStep 
            formData={formData} 
            setFormData={setFormData} 
            onBack={() => setStep(1)} // Uses LocationStep's internal back arrow
            onConfirm={() => setStep(3)} // Uses LocationStep's floating Confirm button
          />
        )}

        {step === 3 && (
          <div className="py-20 text-center animate-in fade-in zoom-in-95">
            <span className="text-4xl mb-4 block">✅</span>
            <p className="text-gray-400 font-bold uppercase text-xs">Review Step coming next...</p>
          </div>
        )}
      </div>

      {/* FOOTER NAVIGATION - Hidden on Step 2 since LocationStep brings its own full-width button */}
      {step !== 2 && (
        <div className="pt-6 pb-8 flex gap-3 px-2">
          {step > 1 && (
            <button 
              onClick={handleBack}
              className="px-6 rounded-2xl border-2 border-gray-100 font-bold text-gray-400 hover:bg-gray-50 transition-all"
            >
              ←
            </button>
          )}
          <Button 
            onClick={handleNext} 
            isLoading={loading}
          >
            {step === 3 ? "Complete Registration" : "Next: " + REGISTRATION_STEPS[step]?.title}
          </Button>
        </div>
      )}
    </div>
  );
}