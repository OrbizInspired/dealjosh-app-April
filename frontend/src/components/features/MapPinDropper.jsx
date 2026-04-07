import { useState, useCallback } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '1rem'
};

// Default to Pune since that is your current HQ!
const defaultCenter = {
  lat: 18.5204,
  lng: 73.8567
};

export default function MapPinDropper({ center, onPinDrop }) {
  const [map, setMap] = useState(null);

  // Memoize the map load so it doesn't violently remount on state changes
  const onLoad = useCallback(function callback(mapInstance) {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);

  // When the user physically taps the map to correct their location
  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    onPinDrop({ lat, lng });
  };

  return (
    <div className="w-full relative shadow-sm border-2 border-gray-100 rounded-2xl overflow-hidden group">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center || defaultCenter}
        zoom={15}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={handleMapClick}
        options={{
          disableDefaultUI: true, // Hides messy default Google controls for a premium app feel
          zoomControl: true,
          gestureHandling: "greedy" // Allows smooth one-finger panning on mobile
        }}
      >
        {/* Render the red pin only if we have coordinates */}
        {center && (
          <Marker 
            position={center} 
            animation={window.google?.maps?.Animation?.DROP}
          />
        )}
      </GoogleMap>
    </div>
  );
}