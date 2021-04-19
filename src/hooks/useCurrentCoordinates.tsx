import { useEffect, useState } from "react";

export const useCurrentPosition = () => {
  const [
    currentCoordinates,
    setCurrentCoordinates,
  ] = useState<null | google.maps.LatLngLiteral>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(handleGetCurrentPositionSuccess);
    }
  }, []);

  const handleGetCurrentPositionSuccess = (position: GeolocationPosition) => {
    const { coords } = position;
    setCurrentCoordinates({
      lat: coords.latitude,
      lng: coords.longitude,
    });
  };

  return currentCoordinates;
};
