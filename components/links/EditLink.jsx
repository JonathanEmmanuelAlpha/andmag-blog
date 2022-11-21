import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";
import styles from "../../styles/links/EditLink.module.css";
import { domainName } from "./AwesomeLink.type";

export default function EditLink({ url, top, left, bottom, right }) {
  return (
    <div
      className={styles.wrapper}
      style={{ top: top, left: left, right: right, bottom: bottom }}
    >
      <Link href={`${domainName}${url}`}>
        <a>
          <FontAwesomeIcon icon={faEdit} />
        </a>
      </Link>
    </div>
  );
}
