import React, { useRef, useEffect, useState } from "react";

import classes from "./Map.module.css";

import { useCurrentPosition } from "../../hooks/useCurrentCoordinates";
import { UseMap } from "../../hooks/useMap";

interface Props {
  map: UseMap;
}

export const Map: React.FC<Props> = (props) => {
  const mapRef = useRef<null | HTMLDivElement>(null);
  const currentCoordinates = useCurrentPosition();

  useEffect(() => {
    if (mapRef.current) {
      props.map.initMap(mapRef.current);
    }
  }, []);

  useEffect(() => {
    if (currentCoordinates) {
      props.map.setCenter(currentCoordinates);
    }
  }, [currentCoordinates]);

  return <div ref={mapRef} className={classes.root} />;
};
