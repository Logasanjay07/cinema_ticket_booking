import React, { useEffect, useState } from "react";
import "./slider.css";

import img1 from "./76977.jpg";
import img2 from "./55008086649_c309d02d17_h.jpg";
import img3 from "./y51zqwdqubtbgfxvzliet2671kvk.avif";
import img4 from "./Vidaamuyarchi_1740031826672_1740031845718.avif"

const images = [img1, img2, img3,img4];

function Slider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [current]);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="slider-wrapper">
      {/* Heading BELOW NAVBAR */}
      <h2 className="upcoming-title">Upcoming Movies</h2>

      <div className="slider">
        <div
          className="slide-image"
          style={{ backgroundImage: `url(${images[current]})` }}
        ></div>

        <button className="arrow left" onClick={prevSlide}>❮</button>
        <button className="arrow right" onClick={nextSlide}>❯</button>
      </div>
    </div>
  );
}

export default Slider;