export default function GPSLocationTrigger({ onLocationDetected, onLocationFailed }) {
  
  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          onLocationDetected({ lat, lng });
        },
        (error) => {
          console.error("GPS Error:", error);
          alert("Could not detect location. Please allow GPS access or search manually.");
          if (onLocationFailed) onLocationFailed();
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm mt-4">
      <span className="text-sm font-bold text-gray-800">Address Details</span>
      <button
        type="button"
        onClick={handleDetectLocation}
        className="flex items-center gap-2 text-dj-orange text-xs font-black bg-dj-orange/10 px-4 py-2 rounded-full hover:bg-dj-orange hover:text-white transition-colors"
      >
        <span className="text-lg leading-none">⌖</span> Detect Location
      </button>
    </div>
  );
}