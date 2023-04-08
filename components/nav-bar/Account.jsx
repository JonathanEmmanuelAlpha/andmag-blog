import Link from "next/link";
import React from "react";
import styles from "../../styles/nav-bar/Account.module.css";
import { domainName } from "../links/AwesomeLink.type";

export default function Account({ photo, pseudo }) {
  return photo || pseudo ? (
    <Link href={`${domainName}/account/profile`}>
      <a className={styles.wrapper}>
        {photo && <img src={photo} />}
        {pseudo && <span>{pseudo}</span>}
      </a>
    </Link>
  ) : null;
}
