import React from "react";
import AwesomeLink from "../links/AwesomeLink";
import {
  faBlog,
  faPhone,
  faUserCircle,
  faPlayCircle,
  faNewspaper,
  faSignOut,
  faRegistered,
  faPeoplePulling,
} from "@fortawesome/free-solid-svg-icons";
import styles from "../../styles/nav-bar/Navbar.module.css";
import { useAuth } from "../../context/AuthProvider";

export default function Navbar(props) {
  return (
    <nav className={styles.container}>
      <ul className={styles.wrapper}>
        <li>
          <AwesomeLink />
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
          <AwesomeLink
            text="Profile"
            icon={faUserCircle}
            url="/account/profile"
          />
        </li>
      </ul>
    </nav>
  );
}
