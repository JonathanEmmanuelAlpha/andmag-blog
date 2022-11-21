import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import styles from "../../styles/images-manipulation/Carousel.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

export function Slider(props) {
  return props.isActiveSlide ? (
    <li className={styles.slider} data-active>
      {props.children}
    </li>
  ) : (
    <li className={styles.slider}>{props.children}</li>
  );
}
Slider.propTypes = {
  isActiveSlide: PropTypes.bool,
};

function Carousel(props) {
  const carouselRef = useRef();

  useEffect(() => {
    const navigateBetweenImage = (event) => {
      const offset = event.target.dataset.carouselButton === "next" ? 1 : -1;
      const slides = event.target
        .closest("[data-carousel]")
        .querySelector("[data-slides]");

      const activeSlide = slides.querySelector("[data-active]");

      let newIndex = [...slides.children].indexOf(activeSlide) + offset;
      if (newIndex < 0) newIndex = slides.children.length - 1;
      if (newIndex >= slides.children.length) newIndex = 0;

      slides.children[newIndex].dataset.active = true;
      delete activeSlide.dataset.active;
    };

    const slides = carouselRef.current.querySelectorAll("li");

    if (slides.length <= 1) {
      carouselRef.current.querySelectorAll("button").forEach((button) => {
        button.style.display = "none";
      });
    } else {
      carouselRef.current.querySelectorAll("button").forEach((button) => {
        button.style.display = "inline-block";
      });
    }

    const buttons = document.querySelectorAll("[data-carousel-button]");
    buttons.forEach((button) => {
      button.addEventListener("click", navigateBetweenImage);
    });

    return () => {
      buttons.forEach((button) => {
        button.removeEventListener("click", navigateBetweenImage);
      });
    };
  }, []);

  return (
    <div className={styles.carousel} ref={carouselRef} data-carousel>
      <button
        className={`${styles.carousel_btn} ${styles.prev}`}
        data-carousel-button="prev"
        onClick={props.onSlideChange}
      >
        <FontAwesomeIcon icon={faAngleLeft} />
      </button>
      <button
        className={`${styles.carousel_btn} ${styles.next}`}
        data-carousel-button="next"
        onClick={props.onSlideChange}
      >
        <FontAwesomeIcon icon={faAngleRight} />
      </button>
      <ul data-slides>{props.children}</ul>
    </div>
  );
}

Carousel.propTypes = {
  onSlideChange: PropTypes.func,
};

export default Carousel;
