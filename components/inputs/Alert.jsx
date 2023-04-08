import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import useDebounceEffect from "../../hooks/useDebounceEffect";
import styles from "../../styles/inputs/Alert.module.css";

export default function Alert({ message, type = "danger" }) {
  return (
    <div className={styles.wrapper} data-type={type}>
      <FontAwesomeIcon icon={faInfoCircle} />
      <span>{message}</span>
    </div>
  );
}
