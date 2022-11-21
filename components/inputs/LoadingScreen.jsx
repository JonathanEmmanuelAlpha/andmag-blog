import React from "react";
import styles from "../../styles/inputs/LoadingScreen.module.css";
import CircularProgressBar from "./CircularProgressBar";

export default function LoadingScreen() {
  return (
    <div className={styles.container}>
      <CircularProgressBar
        trackColor={"#333"}
        indicatorColor="#f3f"
        size={50}
        trackWidth={5}
        indicatorWidth={5}
        spinnerMode={true}
        progress={20}
      />
    </div>
  );
}
