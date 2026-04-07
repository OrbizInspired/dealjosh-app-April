import { useEffect, useState } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import MapPinDropper from '@/components/features/MapPinDropper';
import AddressDetailsCard from '@/components/features/AddressDetailsCard';
import { reverseGeocode } from '@/utils/geoUtils';

const libraries = ['places'];

export default function LocationStep({ formData, setFormData, onBack, onConfirm }) {
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries,
  });

  const currentCenter = formData.latitude && formData.longitude 
    ? { lat: formData.latitude, lng: formData.longitude } 
    : { lat: 18.5204, lng: 73.8567 };

  useEffect(() => {
    if (formData.latitude && formData.longitude && isLoaded) {
      updateAddressFields(formData.latitude, formData.longitude);
    }
  }, [formData.latitude, formData.longitude, isLoaded]);

  const updateAddressFields = async (lat, lng) => {
    setIsLoadingAddress(true);
    const resolved = await reverseGeocode(lat, lng, apiKey);
    
    setFormData(prev => ({
      ...prev,
      shopAddress: resolved.street || prev.shopAddress,
      landmark: resolved.landmark || prev.landmark,
      city: resolved.city || prev.city,
      state: resolved.state || prev.state,
      pinCode: resolved.pinCode || prev.pinCode
    }));
    setIsLoadingAddress(false);
  };

  const handlePinDrop = ({ lat, lng }) => {
    setFormData({ ...formData, latitude: lat, longitude: lng });
  };

  if (loadError) return <div className="p-10 text-center text-red-500 font-bold">Failed to load Google Maps.</div>;

  return (
    <div className="relative w-full h-[80vh] flex flex-col rounded-3xl overflow-hidden bg-gray-100 animate-in zoom-in-95 duration-500 shadow-inner">
      
      {/* MAP LAYER */}
      <div className="absolute inset-0 z-0">
        {!isLoaded ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="animate-pulse text-dj-orange font-bold tracking-widest uppercase text-xs">Waking up Maps Engine...</span>
          </div>
        ) : (
          <MapPinDropper center={currentCenter} onPinDrop={handlePinDrop} />
        )}
      </div>

      {/* HEADER LAYER */}
      <div className="relative z-10 flex items-center justify-between p-4 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <button onClick={onBack} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-dj-orange hover:bg-gray-50 transition-colors">
          ←
        </button>
        <h2 className="text-lg font-black text-dj-orange uppercase tracking-tighter">Select Location</h2>
        <div className="w-10"></div>
      </div>

      {/* BOTTOM UI LAYER */}
      <div className="absolute bottom-0 left-0 w-full p-4 z-10 flex flex-col gap-3">
        
        <AddressDetailsCard 
          formData={formData} 
          isLoading={isLoadingAddress} 
        />

        <button 
          onClick={onConfirm}
          className="w-full bg-[#EAB308] hover:bg-[#D9A006] text-white font-black text-lg py-4 rounded-2xl shadow-md transition-colors border border-[#CFA00D]"
        >
          ⌖ Confirm Location
        </button>
      </div>

    </div>
  );
}