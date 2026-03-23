import React from "react";
import Slider from "react-slick";
import PropTypes from "prop-types";
import styles from "./ImageSlider.module.scss";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ImageSlider = ({ images }) => {
  const isSingleImage = images.length ===1 ;
  const settings = {
     dots: !isSingleImage,
    infinite: !isSingleImage,
  
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
     arrows: !isSingleImage,
    autoplay: !isSingleImage,
             
    autoplaySpeed: 3000, 
    pauseOnHover: true,
  };

  if (!images?.length) {
    return <p className={styles.noImages}>No images available.</p>;
  }

  return (
    <div className={styles.sliderWrapper}>
      <Slider {...settings}>
        {images.map((img) => (
          <div key={img.id} className={styles.slide}>
            <img
  src={img.url }
  alt={`Product ${img.id}`}
  className={styles.image}
/>

          </div>
        ))}
      </Slider>
    </div>
  );
};

ImageSlider.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.any.isRequired,
      url: PropTypes.string.isRequired,
    })
  ),
};

export default ImageSlider;
