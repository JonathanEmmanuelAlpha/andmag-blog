import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import styles from "../../styles/actions/Popup.module.css";

export default function Popup({ open, title, onTop, onClose, children }) {
  return (
    <div
      className={styles.container}
      data-direction={onTop ? "to-top" : "to-bottom"}
      data-active={open}
    >
      <h1>{title}</h1>
      <div className={styles.wrapper}>{children}</div>
      <button className={styles.close_btn} onClick={onClose}>
        <FontAwesomeIcon icon={faClose} />
      </button>
    </div>
  );
}
