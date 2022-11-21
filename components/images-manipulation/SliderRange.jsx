import React from "react";
import PropTypes from "prop-types";
import styles from "../../styles/images-manipulation/SliderRange.module.css";

function SliderRange(props) {
  return (
    <div className={styles.slider_range}>
      <input
        type="range"
        min={props.min}
        max={props.max}
        value={props.value}
        onChange={props.handleChange}
      />
    </div>
  );
}
SliderRange.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  value: PropTypes.any.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default SliderRange;
