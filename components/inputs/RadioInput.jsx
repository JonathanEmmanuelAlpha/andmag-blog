import React from "react";
import PropTypes from "prop-types";
import styles from "../../styles/inputs/RadioInput.module.css";

function RadioInput(props) {
  return (
    <div
      className={styles.input_rad}
      style={{ width: props.styleWidth, height: props.styleHeight }}
    >
      <input
        type="radio"
        checked={props.active}
        name={props.name}
        value={props.value}
        id={props.id}
        onChange={props.handleChange}
        onClick={(event) => {
          const parent = event.target.parentElement;
          const currentlabel = parent.querySelector("label");

          const labels = parent.parentElement.querySelectorAll("label");
          labels.forEach(
            (label) => label !== currentlabel && delete label.dataset.active
          );
          currentlabel.dataset.active = true;
        }}
      />
      <label htmlFor={props.id} id={props.id} data-active={props.active}>
        {props.icon}
        <span>{props.label}</span>
      </label>
    </div>
  );
}
RadioInput.propTypes = {
  active: PropTypes.bool,
  label: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
  styleWidth: PropTypes.string,
  styleHeight: PropTypes.string,
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default RadioInput;
