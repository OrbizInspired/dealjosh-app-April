export async function reverseGeocode(lat, lng, apiKey) {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
    );
    const data = await response.json();

    if (data.status === "OK" && data.results[0]) {
      const result = data.results[0];
      const fullAddress = result.formatted_address;
      
      let street = "", landmark = "", city = "", state = "", pinCode = "";

      // Dissect the Google address components into our specific UI fields
      result.address_components.forEach(component => {
        const types = component.types;

        if (types.includes("route")) street = component.long_name;
        if (types.includes("sublocality") || types.includes("neighborhood")) {
          if (!landmark) landmark = component.long_name;
        }
        if (types.includes("locality")) city = component.long_name;
        if (types.includes("administrative_area_level_1")) state = component.short_name; // e.g., "CA" or "MH"
        if (types.includes("postal_code")) pinCode = component.long_name;
      });

      // Fallback for street if route is missing
      if (!street && landmark) street = landmark;

      return { fullAddress, street, landmark, city, state, pinCode };
    }
    throw new Error("No address found for this location.");
  } catch (error) {
    console.error("Geocoding Error:", error);
    return { fullAddress: "", street: "", landmark: "", city: "", state: "", pinCode: "" };
  }
}