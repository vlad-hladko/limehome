import React, { useCallback } from "react";
import HotelCard from "./components/HotelCard";
import classes from "./App.module.css";
import Map from "./components/Map";
import { useMap } from "./hooks/useMap";
import Slider from "./components/Slider";
import Header from "./components/Header";
import { MarkerContext } from "./context";

export default function App() {
  const googleMap = useMap();

  const setActiveMarker = useCallback((index: number) => {
    googleMap.highlightMarker(index);
  }, []);

  return (
    <MarkerContext.Provider value={{ setActiveMarker }}>
      <div className={classes.app}>
        <Header />
        <Map map={googleMap} />
        <Slider className={classes.slider} slideWidth={300}>
          {googleMap.hotels.map((hotel, index) => (
            <div key={hotel.place_id || index} className={classes.slide}>
              <HotelCard hotel={hotel} />
            </div>
          ))}
        </Slider>
      </div>
    </MarkerContext.Provider>
  );
}
