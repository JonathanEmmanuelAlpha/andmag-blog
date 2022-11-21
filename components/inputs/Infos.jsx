import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import styles from "../../styles/inputs/Infos.module.css";
import AwesomeLink from "../links/AwesomeLink";

export default function Infos({ title, message, link1, link2 }) {
  return (
    <div className={styles.container}>
      <h2>{title}</h2>
      <p>{message}</p>
      <div className={styles.links}>
        <AwesomeLink
          text={link1.text}
          direction="horizontal"
          icon={faArrowLeft}
          url={link1.url}
        />
        <AwesomeLink
          text={link2.text}
          direction="horizontal"
          reverse
          icon={faArrowRight}
          url={link2.url}
        />
      </div>
    </div>
  );
}
