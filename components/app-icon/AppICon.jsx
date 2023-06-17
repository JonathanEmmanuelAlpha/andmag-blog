import {
  faArrowLeft,
  faArrowRight,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dashify from "dashify";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useNotification } from "../../context/NotificationProvider";
import toTimeString from "../../helpers/toTimeString";
import styles from "../../styles/app-icon/app.module.css";
import { CircleSeparator } from "../article/ArticleContainer";
import LoadingScreen from "../inputs/LoadingScreen";
import { domainName } from "../links/AwesomeLink.type";

export function FacebookIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <title>facebook</title>
      <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z" />
    </svg>
  );
}

export function TwiterIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <title>twitter</title>
      <path d="M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10C2.38,10 2.38,10 2.38,10.03C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,16 6,17.26 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.7,21 8.12,21C16,21 20.33,14.46 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z" />
    </svg>
  );
}

export function EmailIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <title>email</title>
      <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z" />
    </svg>
  );
}

export function WhatsappIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <title>whatsapp</title>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M8.53 7.33C8.37 7.33 8.1 7.39 7.87 7.64C7.65 7.89 7 8.5 7 9.71C7 10.93 7.89 12.1 8 12.27C8.14 12.44 9.76 14.94 12.25 16C12.84 16.27 13.3 16.42 13.66 16.53C14.25 16.72 14.79 16.69 15.22 16.63C15.7 16.56 16.68 16.03 16.89 15.45C17.1 14.87 17.1 14.38 17.04 14.27C16.97 14.17 16.81 14.11 16.56 14C16.31 13.86 15.09 13.26 14.87 13.18C14.64 13.1 14.5 13.06 14.31 13.3C14.15 13.55 13.67 14.11 13.53 14.27C13.38 14.44 13.24 14.46 13 14.34C12.74 14.21 11.94 13.95 11 13.11C10.26 12.45 9.77 11.64 9.62 11.39C9.5 11.15 9.61 11 9.73 10.89C9.84 10.78 10 10.6 10.1 10.45C10.23 10.31 10.27 10.2 10.35 10.04C10.43 9.87 10.39 9.73 10.33 9.61C10.27 9.5 9.77 8.26 9.56 7.77C9.36 7.29 9.16 7.35 9 7.34C8.86 7.34 8.7 7.33 8.53 7.33Z" />
    </svg>
  );
}

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
      <a href={"/logo/AG.png"} target="_blank" rel="noreferrer">
        <Image
          src="/logo/AG.png"
          alt="andmag-ground logo"
          width={"40px"}
          height={"40px"}
          priority
        />
      </a>
    </div>
  );
}

export function NotificationToast({ thumbnail, blog, title, url, at }) {
  return (
    <div className={styles.toast_container}>
      <header>
        <div className={styles.content}>
          <Link href={url}>{title}</Link>
        </div>
        {thumbnail && (
          <div className={styles.img}>
            <Image src={thumbnail} alt="thumbnail" priority layout="fill" />
          </div>
        )}
      </header>
      <footer>
        <Image
          src={blog.logo}
          alt="blog - logo"
          priority
          width={"30px"}
          height={"30px"}
        />
        <Link href={`/blogs/${blog.id}`}>{blog.name}</Link>
      </footer>
    </div>
  );
}

function NotificationItem({ url, blogLogo, title, at, thumbnail }) {
  return (
    <Link href={url || "/"}>
      <a className={styles.item}>
        <Image
          className={`${styles.logo} skeleton`}
          src={blogLogo}
          alt={title + " - logo"}
          priority
          width={"50px"}
          height={"50px"}
        />
        <div className={styles.det}>
          <div>
            <strong>{title}</strong>
            <span>{toTimeString(at.seconds * 1000)}</span>
          </div>
          {thumbnail && (
            <Image
              src={thumbnail}
              className={styles.thumb + " skeleton"}
              alt={title + " - thumbnail"}
              priority
              width={"120px"}
              height={"70px"}
            />
          )}
        </div>
      </a>
    </Link>
  );
}

function NotificationWrapper({ loading, notifications, open, handleClick }) {
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
      {loading ? (
        <LoadingScreen />
      ) : notifications.length > 0 ? (
        notifications.map((notif) => {
          return (
            <NotificationItem
              key={notif.id}
              blogLogo={notif.blog.logo}
              at={{ seconds: notif.createAt.seconds }}
              thumbnail={notif.thumbnail}
              title={notif.title}
              url={
                notif.thumbnail
                  ? `${domainName}/articles/${dashify(notif.title, {
                      condense: true,
                    })}-${notif.targetId}`
                  : `${domainName}/trainnings/train?testChannel=${notif.targetId}`
              }
            />
          );
        })
      ) : (
        <p className={styles.none}>Aucune nouvelles notifications !</p>
      )}
    </div>
  );
}

export function NotificationButton() {
  const { loading, notifications, onRead, onClose } = useNotification();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.notifs_container}>
      <button
        className={styles.notifs}
        onClick={() => {
          setIsOpen(true);
          onRead();
        }}
      >
        <FontAwesomeIcon icon={faBell} />
        {notifications.length > 0 && (
          <div className={styles.nb}>
            <span>
              {notifications.length > 10
                ? notifications.length
                : `0${notifications.length}`}
            </span>
          </div>
        )}
      </button>
      <NotificationWrapper
        notifications={notifications}
        loading={loading}
        open={isOpen}
        handleClick={() => {
          setIsOpen(false);
          onClose();
        }}
      />
    </div>
  );
}
