import { faArrowLeft, faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React, { useState } from "react";
import toTimeString from "../../helpers/toTimeString";
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
      <img src="/logo/AG.png" alt="andmag-ground logo" />
    </div>
  );
}

function NotificationItem({ url, blogLogo, title, at, thumbnail }) {
  return (
    <Link href={url || "/"}>
      <a className={styles.item}>
        <img className={styles.logo} src={blogLogo} />
        <div className={styles.det}>
          <div>
            <strong>{title}</strong>
            <span>{toTimeString(at.seconds * 1000)}</span>
          </div>
          {thumbnail && <img src={thumbnail} className={styles.thumb} />}
        </div>
      </a>
    </Link>
  );
}

function NotificationWrapper({ open, handleClick }) {
  if (!open) return null;

  return (
    <div className={styles.wrapper}>
      <div className={styles.info}>
        <span>Notifications</span>
        <button onClick={handleClick}>
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Retour</span>
        </button>
      </div>
      <NotificationItem
        blogLogo={"/logo/AG.png"}
        at={{ seconds: new Date().getTime() }}
        thumbnail={"/images/about/android.jpg"}
        title={"Débuter la programmation par le C."}
      />
    </div>
  );
}

export function NotificationButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.notifs_container}>
      <button className={styles.notifs} onClick={() => setIsOpen(!isOpen)}>
        <FontAwesomeIcon icon={faBell} />
        <div className={styles.nb}>
          <span>23</span>
        </div>
      </button>
      <NotificationWrapper open={isOpen} handleClick={() => setIsOpen(false)} />
    </div>
  );
}
