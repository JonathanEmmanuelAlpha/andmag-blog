import { faWifi3 } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import styles from "../styles/components-styles/OfflineScreen.module.css";

export default function OfflineScreen() {
  return (
    <div className={styles.wrapper}>
      <FontAwesomeIcon icon={faWifi3} />
      <h1>Conneter vous à internet</h1>
      <p>
        Vous n'êtes actuellement pas connecté à internet. Vérifier votre
        connexion puis réessayez
      </p>
      <button onClick={() => window.location.reload()}>réessayer</button>
    </div>
  );
}
