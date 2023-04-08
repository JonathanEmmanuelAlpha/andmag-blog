import React from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import Link from "next/link";
import styles from "../../styles/trainning/DomainCard.module.css";

function DomainCard(props) {
  return (
    <Link href={props.domainRoute}>
      <a className={styles.container}>
        <div className={styles.head}>
          <Image
            className="skeleton"
            src={props.banner}
            width={350}
            height={250}
            priority
          />
          <div className={styles.banner_overlay} />
          <h1 className="thin-text-3d">{props.title}</h1>
        </div>
        <div className={styles.wrapper}>
          <p>{props.description.slice(0, 254)}</p>
          <div className={styles.infos}>
            {props.tests ? (
              props.tests.length > 10 ? (
                <span>{props.tests.length} tests disponibles</span>
              ) : (
                <span>0{props.tests.length} tests disponibles</span>
              )
            ) : (
              <span>00 tests disponibles</span>
            )}
          </div>
        </div>
      </a>
    </Link>
  );
}

DomainCard.propTypes = {
  domainRoute: PropTypes.string.isRequired,
  banner: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  tests: PropTypes.array,
};

export default DomainCard;
