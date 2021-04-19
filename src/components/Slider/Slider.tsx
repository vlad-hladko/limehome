import React, { useState, useMemo, useEffect, useRef, useContext } from "react";
import { MarkerContext } from "../../context";

import classes from "./Slider.module.css";

interface Props {
  slideWidth: number;
  className?: string;
}

export const Slider: React.FC<Props> = (props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchPosition, setTouchPosition] = useState<null | number>(null);
  const [currentPosition, setCurrentPosition] = useState<null | number>(null);
  const [pressed, setPressed] = useState<boolean>(false);
  const [slidesCount, setSlidesCount] = useState(1);
  const markerContext = useContext(MarkerContext);
  const animationTimer = useRef<null | number>(null);
  const sliderRef = useRef<HTMLDivElement | null>(null);

  const length = useMemo(() => React.Children.count(props.children), [
    props.children,
  ]);
  const maxIndex = useMemo(() => length - slidesCount, [length]);

  useEffect(() => {
    calculateSlidersCount();
    document.addEventListener("touchend", handleMoveEnd);
    document.addEventListener("mouseup", handleMoveEnd);
    window.addEventListener("resize", calculateSlidersCount);

    return () => {
      document.removeEventListener("touchend", handleMoveEnd);
      document.removeEventListener("mouseup", handleMoveEnd);
      window.removeEventListener("resize", calculateSlidersCount);
      if (animationTimer.current) cancelAnimationFrame(animationTimer.current);
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--number-of-slides",
      String(slidesCount)
    );
  }, [slidesCount]);

  useEffect(() => {
    resetState();
  }, [length]);

  useEffect(() => {
    if (markerContext) {
      markerContext.setActiveMarker(currentIndex);
    }
  }, [currentIndex]);

  const calculateSlidersCount = () => {
    const desiredCount = Math.floor(getSliderWidth() / props.slideWidth) || 1;
    setSlidesCount(desiredCount);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touchDown = e.touches[0].clientX;
    setTouchPosition(touchDown);
    setPressed(true);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    const touchDown = e.clientX;
    setTouchPosition(touchDown);
    setPressed(true);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const currentTouch = e.touches[0].clientX;
    makeAnimation(currentTouch);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const currentTouch = e.clientX;
    makeAnimation(currentTouch);
  };

  const handleMoveEnd = (e: Event | React.TouchEvent | React.MouseEvent) => {
    e.stopPropagation();
    moveToActiveSlide();
    setTouchPosition(null);
    setCurrentPosition(null);
    setPressed(false);
  };

  const makeAnimation = (position: number) => {
    animationTimer.current = requestAnimationFrame(() =>
      setCurrentPosition(position)
    );
  };

  const moveToActiveSlide = () => {
    const activeSlide = calculateActiveSlide();
    moveToSlide(activeSlide);
  };

  const moveToSlide = (slide: number) => {
    if (slide <= length && slide >= 0 && pressed) {
      setCurrentIndex(slide);
    }
  };

  const calculateActiveSlide = () => {
    if (!currentPosition || !touchPosition) return currentIndex;
    const sliderWidth = getSliderWidth();
    const scrolledSlidesNumber = Math.round(
      -((currentPosition - touchPosition) / sliderWidth) * slidesCount
    );

    let desiredIndex = currentIndex + scrolledSlidesNumber;
    if (desiredIndex < 0) {
      return 0;
    }
    if (desiredIndex > maxIndex) {
      return maxIndex;
    }

    return desiredIndex;
  };

  const getSliderWidth = () => {
    if (!sliderRef.current) return 0;

    return sliderRef.current.offsetWidth;
  };

  const resetState = () => {
    setCurrentIndex(0);
    setPressed(false);
    setCurrentPosition(null);
    setTouchPosition(null);
  };

  const sliderStyles = useMemo(
    () => ({
      transform:
        pressed && currentPosition && touchPosition
          ? `translateX(calc(-${(currentIndex * 100) / slidesCount}% + ${
              currentPosition - touchPosition
            }px))`
          : `translateX(-${(currentIndex * 100) / slidesCount}%)`,
      cursor: pressed ? "grabbing" : "grab",
    }),
    [pressed, currentIndex, currentPosition, touchPosition]
  );

  return (
    <div
      className={`${classes.container} ${
        props.className ? props.className : ""
      }`}
    >
      <div className={classes.wrapper}>
        <div
          ref={sliderRef}
          className={classes.contentWrapper}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMoveEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMoveEnd}
        >
          <div className={classes.content} style={sliderStyles}>
            {props.children}
          </div>
        </div>
      </div>
    </div>
  );
};
