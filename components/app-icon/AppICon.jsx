import React from "react";
import styles from "../../styles/app-icon/app.module.css";

function MenuIcons({ color, onClick }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="55"
      height="35"
      viewBox="0 0 55 35"
      onClick={onClick}
    >
      <path
        id="Menu_icon"
        data-name="Menu icon"
        d="M55,35H0V29.167H55V35Zm0-14.582H0V14.585H55v5.833ZM55,5.833H0V0H55V5.833Z"
        fill={color ? `${color}` : "#fff"}
      />
    </svg>
  );
}

export default function AppICon({ onOpen }) {
  return (
    <div className={styles.container}>
      <MenuIcons color={"var(--color)"} onClick={onOpen} />
      <img src="/images/AG.png" alt="andmag-ground.png" />
      <h1>AG</h1>
    </div>
  );
}
