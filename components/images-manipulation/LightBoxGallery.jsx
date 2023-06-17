import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import styles from "../../styles/images-manipulation/LightBoxGallery.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCrop,
  faDownload,
  faExpand,
  faFilter,
  faRotateLeft,
  faRotateRight,
  faSearchMinus,
  faSearchPlus,
  faTimesRectangle,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import Carousel, { Slider } from "./Carousel";
import SliderRange from "./SliderRange";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../firebase";

const DEFAULT_FILTERS_OPTIONS = [
  {
    name: "Brightness",
    property: "brightness",
    value: 100,
    range: { min: 0, max: 200 },
    unit: "%",
  },
  {
    name: "Blur",
    property: "blur",
    value: 0,
    range: { min: 0, max: 20 },
    unit: "px",
  },
  {
    name: "Contrast",
    property: "contrast",
    value: 100,
    range: { min: 0, max: 200 },
    unit: "%",
  },
  {
    name: "Grayscale",
    property: "grayscale",
    value: 0,
    range: { min: 0, max: 100 },
    unit: "%",
  },
  {
    name: "Hue_rotate",
    property: "hue-rotate",
    value: 0,
    range: { min: 0, max: 360 },
    unit: "deg",
  },
  {
    name: "Invert",
    property: "invert",
    value: 0,
    range: { min: 0, max: 100 },
    unit: "%",
  },
  {
    name: "Saturation",
    property: "saturate",
    value: 100,
    range: { min: 0, max: 200 },
    unit: "%",
  },
  {
    name: "Sepia",
    property: "sepia",
    value: 0,
    range: { min: 0, max: 100 },
    unit: "%",
  },
];

const DEFAULT_TRANSFORM_OPT = [
  {
    property: "scale",
    value: 1,
    step: 0.1,
    unit: "",
  },
  {
    property: "rotateZ",
    value: 0,
    step: 45,
    unit: "deg",
  },
];

function EffectButton(props) {
  return props.active ? (
    <button data-active-button-active onClick={props.handleClick}>
      {props.name}
    </button>
  ) : (
    <button onClick={props.handleClick}>{props.name}</button>
  );
}
EffectButton.propTypes = {
  name: PropTypes.string.isRequired,
  active: PropTypes.bool,
  handleClick: PropTypes.func.isRequired,
};

function LightBoxGallery(props) {
  const lightBoxRef = useRef();

  const [filterOptions, setFilterOptions] = useState(DEFAULT_FILTERS_OPTIONS);
  const [selectedFilterIndex, setSelectedFilterIndex] = useState(0);
  const selectedFilter = filterOptions[selectedFilterIndex];

  const [transformsOptions, setTransformsOptions] = useState(
    DEFAULT_TRANSFORM_OPT
  );

  const getCurrentImage = () => {
    const slides = lightBoxRef.current.querySelector("[data-slides]");
    const activeSlide = slides.querySelector("[data-active]");

    return activeSlide.querySelector("img");
  };

  const handerSliderChange = (event) => {
    setFilterOptions((prevFilters) => {
      return prevFilters.map((filter, index) => {
        if (index !== selectedFilterIndex) return filter;
        return { ...filter, value: event.target.value };
      });
    });
  };

  const handerTransformChange = (event) => {
    const targetId = event.target.getAttribute("id");
    const selectedIndex = targetId.includes("button-zoom") ? 0 : 1;

    setTransformsOptions((prevTransforms) => {
      return prevTransforms.map((option, index) => {
        if (index !== selectedIndex) return option;
        return {
          ...option,
          value:
            selectedIndex === 0
              ? targetId.includes("out")
                ? option.value - option.step
                : option.value + option.step
              : targetId.includes("left")
              ? option.value - option.step
              : option.value + option.step,
        };
      });
    });
  };

  const resetImageToOrigin = () => {
    setFilterOptions(DEFAULT_FILTERS_OPTIONS);
    setTransformsOptions(DEFAULT_TRANSFORM_OPT);
  };

  const getFiltersValue = () => {
    return filterOptions.map((filter) => {
      return `${filter.property}(${filter.value}${filter.unit})`;
    });
  };

  const getTransformsValue = () => {
    return transformsOptions.map((option) => {
      return `${option.property}(${option.value}${option.unit})`;
    });
  };

  const getImageStyle = () => {
    const filters = getFiltersValue();
    const transforms = getTransformsValue();

    return { filter: filters.join(" "), transform: transforms.join(" ") };
  };

  const drawCanvasContext = () => {
    const filters = getFiltersValue();
    const transforms = getTransformsValue();
    const currentImage = getCurrentImage();
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = currentImage.naturalWidth;
    canvas.height = currentImage.naturalHeight;

    context.filter = filters.join(" ");
    context.transform = transforms.join(" ");
    context.drawImage(currentImage, 0, 0, canvas.width, canvas.height);

    return {
      currentImage: currentImage,
      canvas: canvas,
    };
  };

  function handleDownload() {
    const httpsRef = ref(storage, getCurrentImage().src);
    getDownloadURL(httpsRef)
      .then((url) => {
        const xhr = new XMLHttpRequest();
        xhr.responseType = "blob";
        xhr.onload = (event) => {
          const blob = xhr.response;
        };
        xhr.open("GET", url);
        xhr.send();
      })
      .catch((error) => {
        console.log("Download error: ", error);
      });
  }

  useEffect(() => {
    if (!window) return;

    const exitLightBox = (event) => {
      if (
        event.keyCode === 27 ||
        event.code === "Escape" ||
        event.key === "Escape"
      ) {
        closeLightBox();
      }
    };

    window.addEventListener("keydown", exitLightBox);

    return () => {
      window.removeEventListener("keydown", exitLightBox);
    };
  }, []);

  return (
    <div className={styles.container} ref={lightBoxRef}>
      <div className={styles.header}>
        <div className={styles.effect_group}>
          <div className={styles.effect_zone}>
            {filterOptions.map((filter, index) => (
              <EffectButton
                key={index}
                name={filter?.name}
                active={index === selectedFilterIndex}
                handleClick={() => setSelectedFilterIndex(index)}
              />
            ))}
          </div>
        </div>
        <div className={styles.action_group}>
          <button
            id="button-zoom-out"
            onClick={handerTransformChange}
            title="Zoom out"
          >
            <FontAwesomeIcon icon={faSearchMinus} />
          </button>
          <button
            id="button-zoom-in"
            onClick={handerTransformChange}
            title="Zoom in"
          >
            <FontAwesomeIcon icon={faSearchPlus} />
          </button>
          <button
            id="button-rotate-right"
            onClick={handerTransformChange}
            title="Roter vers la gauche"
          >
            <FontAwesomeIcon icon={faRotateRight} />
          </button>
          <button
            id="button-rotate-left"
            onClick={handerTransformChange}
            title="Roter vers la droite"
          >
            <FontAwesomeIcon icon={faRotateLeft} />
          </button>
          <button
            onClick={() =>
              getCurrentImage().classList.toggle(`${styles.expand}`)
            }
            title="centrer sur l'image"
          >
            <FontAwesomeIcon icon={faExpand} />
          </button>
          <button onClick={handleDownload} title="Télécharger l'image">
            <FontAwesomeIcon icon={faDownload} />
          </button>
        </div>
        <div className={styles.exit_group}>
          <button
            onClick={(event) => props.closeLightBox()}
            title="Fermer la gallery"
          >
            <FontAwesomeIcon icon={faTimesRectangle} />
          </button>
        </div>
      </div>
      <div className={styles.wrapper}>
        <Carousel onSlideChange={() => resetImageToOrigin()}>
          {props.images.length > 1 ? (
            props.images.map((url, index) =>
              url === props.activeImage ? (
                <Slider key={index} isActiveSlide>
                  <img src={url} style={getImageStyle()} />
                </Slider>
              ) : (
                <Slider key={index}>
                  <img src={url} style={getImageStyle()} />
                </Slider>
              )
            )
          ) : (
            <Slider isActiveSlide>
              <img src={props.images[0]} style={getImageStyle()} />
            </Slider>
          )}
        </Carousel>
      </div>
      <div className={styles.range_elt}>
        <SliderRange
          min={selectedFilter?.range?.min}
          max={selectedFilter?.range?.max}
          value={selectedFilter?.value}
          handleChange={handerSliderChange}
        />
      </div>
    </div>
  );
}

LightBoxGallery.propTypes = {
  isActive: PropTypes.bool,
  closeLightBox: PropTypes.func.isRequired,
  images: PropTypes.array.isRequired,
  activeImage: PropTypes.string,
};

export default LightBoxGallery;
