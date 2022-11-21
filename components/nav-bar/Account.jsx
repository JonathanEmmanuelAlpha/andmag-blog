import React from "react";
import styles from "../../styles/nav-bar/Account.module.css";

export default function Account({ photo, pseudo }) {
  return photo || pseudo ? (
    <div className={styles.wrapper}>
      {photo && <img src={photo} />}
      {pseudo && <span>{pseudo}</span>}
    </div>
  ) : null;
}
