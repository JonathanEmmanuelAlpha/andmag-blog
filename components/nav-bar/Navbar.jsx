import React from "react";
import AwesomeLink from "../links/AwesomeLink";
import {
  faBlog,
  faPhone,
  faPlayCircle,
  faNewspaper,
  faSignOut,
  faRegistered,
  faPeoplePulling,
} from "@fortawesome/free-solid-svg-icons";
import styles from "../../styles/nav-bar/Navbar.module.css";
import { useAuth } from "../../context/AuthProvider";
import { NotificationButton } from "../app-icon/AppICon";

export default function Navbar(props) {
  return (
    <nav className={styles.container}>
      <ul className={styles.wrapper}>
        <li>
          <AwesomeLink text="Accueil" />
        </li>
        <li>
          <AwesomeLink icon={faNewspaper} text="Articles" url="/articles" />
        </li>
        <li>
          <AwesomeLink icon={faBlog} text="Blogs" url="/blogs" />
        </li>
        <li className="dropdown">
          <AwesomeLink icon={faPeoplePulling} text="Train" url="/trainnings" />
        </li>
        <li>
          <NotificationButton />
        </li>
      </ul>
    </nav>
  );
}
