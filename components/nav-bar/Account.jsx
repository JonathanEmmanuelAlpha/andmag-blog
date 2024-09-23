import Image from "next/image";
import Link from "next/link";
import React from "react";
import styles from "../../styles/nav-bar/Account.module.css";

export default function Account({ photo, pseudo }) {
  return photo || pseudo ? (
    <Link href={`/account/profile`}>
      <a className={styles.wrapper}>
        {photo && (
          <Image
            src={photo}
            className="skeleton"
            width={30}
            height={30}
            priority
          />
        )}
        {pseudo && <span>{pseudo}</span>}
      </a>
    </Link>
  ) : null;
}
