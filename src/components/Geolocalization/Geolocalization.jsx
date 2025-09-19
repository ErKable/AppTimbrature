import React, { useState } from "react";

const GeolocationComponent = () => {
  const [position, setPosition] = useState({ lat: null, lng: null });
  const [error, setError] = useState(null);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          },
        getAddress(position.lat, position.lng));
        },
        (err) => {
          setError(err.message);
        }
      );
    } else {
      setError("Geolocalizzazione non supportata dal browser");
    }
  };

  const getAddress = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );
    const data = await response.json();
    console.log("Indirizzo:", data.address);
  } catch (err) {
    console.error(err);
  }
};

  return (
    <div>
      <button onClick={getLocation}>Timbratura</button>
      {position.lat && <p>Latitudine: {position.lat}</p>}
      {position.lng && <p>Longitudine: {position.lng}</p>}
      {error && <p>Errore: {error}</p>}

      <iframe
  width="100%"
  height="300"
  src={`https://www.google.com/maps?q=${position.lat},${position.lng}&hl=it&z=15&output=embed`}
  title="Mappa"
/>
    </div>
  );
};

export default GeolocationComponent;
