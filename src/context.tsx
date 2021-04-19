import React from "react";

interface Context {
  setActiveMarker: (index: number) => void;
}

export const MarkerContext = React.createContext<null | Context>(null);
