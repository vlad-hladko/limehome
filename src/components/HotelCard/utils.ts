import { noPhoto } from "../../assets";
import { Hotel } from "./interfaces";

export const formatHotelDetailsFromMap = (
  hotel: google.maps.places.PlaceResult
): Hotel => {
  return {
    img: hotel.photos ? hotel.photos[0].getUrl({ maxWidth: 100 }) : noPhoto,
    title: hotel.name || "No name",
    price: getRandomPrice(50, 150),
    description: "Some interesting description here",
    hint: "Designs may very",
  };
};

function getRandomPrice(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}
