import React from "react";
import styles from "../../styles/footer/Footer.module.css";

function Footer(props) {
  return (
    <footer className={styles.container}>
      <div className={styles.rights}>
        <span>
          Copyright &copy; 2022{" "}
          <a
            href="https://andmag-ground.vercel.app/"
            target="_blank"
            rel="noreferrer"
          >
            Andmag-ground{" "}
          </a>
          | All Rights Reserved.
        </span>
      </div>
    </footer>
  );
}

export default Footer;
