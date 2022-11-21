import React from "react";
import PropTypes from "prop-types";
import styles from "../../styles/inputs/SubmitButton.module.css";
import CircularProgressBar from "./CircularProgressBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import useDebounceEffect from "../../hooks/useDebounceEffect";
import { auth } from "../../firebase";

function SubmitButton(props) {
  return (
    <div className={styles.wrapper} data-with-icon={props.icon}>
      <button
        id="sign-in-button"
        type={props.cannotSubmit ? "button" : "submit"}
        disabled={props.loading}
        onClick={props.onClick}
      >
        {props.text && !props.icon && <span>{props.text}</span>}
        {!props.text && !props.icon && <span>Enregistrer</span>}
        {props.icon && <FontAwesomeIcon icon={faPaperPlane} />}
        <div className={styles.overlay} data-active={props.loading}>
          <CircularProgressBar
            trackColor={"#333"}
            indicatorColor="#f7c"
            size={32}
            trackWidth={3}
            indicatorWidth={3}
            spinnerMode={true}
            progress={props.progress}
          />
        </div>
      </button>
    </div>
  );
}

SubmitButton.propTypes = {
  loading: PropTypes.bool,
  cannotSubmit: PropTypes.bool,
  onClick: PropTypes.func,
  text: PropTypes.string,
  icon: PropTypes.bool,
  progress: PropTypes.number,
};

export default SubmitButton;
