import Link from "next/link";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AwesomeLinkProps, domainName } from "./AwesomeLink.type";
import styles from "../../styles/links/AwesomeLink.module.css";
import { useRouter } from "next/router";

export default function AwesomeLink({
  direction = AwesomeLinkProps.direction,
  icon = AwesomeLinkProps.icon,
  text = AwesomeLinkProps.text,
  url = AwesomeLinkProps.url,
  custum = AwesomeLinkProps.custum,
  reverse = AwesomeLinkProps.reverse,
  color,
  handleClick,
  target,
  rel,
}) {
  const router = useRouter();
  const finalUrl = `${domainName}${url}`;

  return (
    <Link href={finalUrl}>
      <a
        data-active={router.asPath === url}
        data-direction={direction}
        data-reverse={reverse}
        className={styles.wrapper}
        onClick={handleClick}
        target={target}
        rel={rel}
      >
        {custum ? icon : <FontAwesomeIcon icon={icon} />}
        <span>{text}</span>
      </a>
    </Link>
  );
}
