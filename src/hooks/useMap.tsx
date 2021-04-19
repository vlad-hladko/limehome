import { useState, useEffect } from "react";

import { Loader } from "@googlemaps/js-api-loader";
import { defaultCoordinates } from "../components/Map/constants";
import { homeIcon, homeIconActive } from "../assets";
import { usePrevious } from "./usePrev";
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY as string;

const loader = new Loader({
  apiKey: API_KEY,
  version: "weekly",
  libraries: ["places"],
});

const zoomLvl = 15;

export const useMap = () => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [currentCenter, setCurrentCenter] = useState<google.maps.LatLngLiteral>(
    defaultCoordinates
  );
  const [
    service,
    setService,
  ] = useState<google.maps.places.PlacesService | null>(null);
  const [hotels, setHotels] = useState<google.maps.places.PlaceResult[]>([]);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [activeMarkerId, setActiveMarkerId] = useState<number>(0);
  const prevMarkerId = usePrevious<number>(activeMarkerId);

  useEffect(() => {
    if (map && currentCenter) {
      map.setCenter(currentCenter);
    }
  }, [map, currentCenter]);

  useEffect(() => {
    if (prevMarkerId !== undefined) {
      const oldMarker = markers[prevMarkerId];
      if (oldMarker) {
        oldMarker.setIcon(homeIcon);
      }
    }
    const marker = markers[activeMarkerId];
    if (marker) {
      marker.setIcon(homeIconActive);
    }
  }, [markers, activeMarkerId, prevMarkerId]);

  useEffect(() => {
    if (map && service) {
      map.addListener("idle", handleMapIdle);
    }
  }, [map, service]);

  useEffect(() => {
    if (!!hotels.length) {
      updateMarkers();
    }
  }, [hotels]);

  const initMap = async (mapContainer: HTMLElement) => {
    await loader.load();
    const map = new google.maps.Map(mapContainer, {
      center: currentCenter,
      zoom: zoomLvl,
      disableDefaultUI: true,
    });
    const service = new google.maps.places.PlacesService(map);
    setMap(map);
    setService(service);
  };

  const setCenter = (coordinates: google.maps.LatLngLiteral) => {
    setCurrentCenter(coordinates);
  };

  const findHotels = (
    map: google.maps.Map,
    service: google.maps.places.PlacesService
  ) => {
    const request = {
      bounds: map.getBounds() as google.maps.LatLngBounds,
      types: ["lodging"],
      location: currentCenter,
    };

    service.nearbySearch(
      request,
      (
        results: google.maps.places.PlaceResult[] | null,
        status: google.maps.places.PlacesServiceStatus
      ) => {
        if (!results || status !== google.maps.places.PlacesServiceStatus.OK) {
          return setHotels([]);
        }
        const boundsAreEqual = compareBounds(request.bounds, map.getBounds());
        if (boundsAreEqual) {
          setHotels(results);
        }
      }
    );
  };

  const compareBounds = (
    a: google.maps.LatLngBounds | undefined,
    b: google.maps.LatLngBounds | undefined
  ) => {
    if (!a || !b) return false;

    return a.equals(b);
  };

  const handleMapIdle = () => {
    if (!map || !service) return setHotels([]);
    findHotels(map, service);
  };

  const updateMarkers = () => {
    deleteAllMarkers();
    const markers = hotels.reduce(
      (
        markersArray: google.maps.Marker[],
        hotel: google.maps.places.PlaceResult
      ) => {
        const marker = createMarker(hotel);
        if (marker) markersArray.push(marker);
        return markersArray;
      },
      []
    );
    setMarkers(markers);
  };

  const createMarker = (place: google.maps.places.PlaceResult) => {
    if (!place.geometry || !place.geometry.location) return;

    const marker = new google.maps.Marker({
      map,
      position: place.geometry.location,
      icon: homeIcon,
      title: place.name,
    });
    marker.addListener("mouseover", () => {
      marker.setIcon(homeIconActive);
    });

    marker.addListener("mouseout", () => {
      marker.setIcon(homeIcon);
    });

    return marker;
  };

  const deleteAllMarkers = () => {
    markers.map((marker) => {
      marker.setMap(null);
    });

    setMarkers([]);
  };

  const highlightMarker = (index: number) => {
    setActiveMarkerId(index);
  };

  return {
    initMap,
    setCenter,
    highlightMarker,
    hotels,
  };
};

export type UseMap = ReturnType<typeof useMap>;
