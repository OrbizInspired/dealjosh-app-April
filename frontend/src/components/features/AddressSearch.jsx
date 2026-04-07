import { useState, useRef } from 'react';
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api';

// We declare this outside the component so React doesn't recreate the array on every render
const libraries = ['places'];

export default function AddressSearch({ onPlaceSelected }) {
  // 1. Boot up the Google Engine securely using your .env key
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [searchValue, setSearchValue] = useState('');
  const autocompleteRef = useRef(null);

  if (loadError) return <div className="text-red-500 text-xs font-bold p-4">Error loading Maps API. Check your API Key.</div>;
  if (!isLoaded) return <div className="text-dj-orange text-xs font-bold p-4 animate-pulse">Waking up Google Maps...</div>;

  // 2. The brain: What happens when they click an address from the dropdown
  const handlePlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();
      
      if (!place.geometry) {
        console.log("User pressed enter without selecting a valid place from the dropdown.");
        return;
      }

      // Extract the gold!
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const address = place.formatted_address;

      // Update the visual input box
      setSearchValue(address);
      
      // Fire the callback to give this data back to our main LocationStep
      onPlaceSelected({ lat, lng, address });
    }
  };

  return (
    <div className="relative group w-full">
      <label className="block text-[10px] font-black text-gray-400 uppercase ml-2 mb-2 tracking-widest">
        Search Shop Address
      </label>
      
      {/* Google's Wrapper that turns a dumb input into a smart Autocomplete */}
      <Autocomplete
        onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
        onPlaceChanged={handlePlaceChanged}
      >
        <input
          type="text"
          placeholder="Start typing your shop's address..."
          className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-dj-orange focus:bg-white outline-none transition-all text-gray-700 font-medium group-hover:border-gray-200 shadow-sm"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          // Safety catch: Prevent 'Enter' from submitting the whole multi-step form
          onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
        />
      </Autocomplete>
    </div>
  );
}