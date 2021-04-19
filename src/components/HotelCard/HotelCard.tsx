import React, { useMemo } from "react";
import Button from "../Button";

import classes from "./HotelCard.module.css";
import { formatHotelDetailsFromMap } from "./utils";

export const cardWidth = 280;

interface Props {
  hotel: google.maps.places.PlaceResult;
}

export const HotelCard: React.FC<Props> = ({ hotel }) => {
  const formattedHotel = useMemo(() => formatHotelDetailsFromMap(hotel), [
    hotel,
  ]);

  return (
    <div className={classes.root} style={{ width: cardWidth }}>
      <img
        alt={formattedHotel.title}
        src={formattedHotel.img}
        className={classes.img}
      />
      <div className={classes.title}>{formattedHotel.title}</div>
      <div className={classes.description}>{formattedHotel.description}</div>
      <div className={classes.price}>&#163;{formattedHotel.price}</div>
      <div className={classes.hint}>{formattedHotel.hint}</div>
      <div className={classes.actions}>
        <Button>Book</Button>
      </div>
    </div>
  );
};
