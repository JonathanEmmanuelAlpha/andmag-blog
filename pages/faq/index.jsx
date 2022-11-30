import { faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import styles from "../../styles/faq/main.module.css";
import SkeletonLayout from "../../components/skeleton-layout/SkeletonLayout";

export default function index() {
  return (
    <SkeletonLayout
      title="Fréquement demandée"
      description="Vous avez des préoccupations par rapport à certains points ? Consulter la faq pour dissiper tous vos doutes."
    >
      <div className={styles.container}>
        <nav className={styles.menu}>
          <h2>Menu</h2>
          <ul>
            <li></li>
          </ul>
        </nav>
        <section className={styles.section}>
          <h1>Questions fréquement demandées</h1>
        </section>
      </div>
      <div className={styles.to_top}>
        <button
          onClick={() => {
            document.body.scrollTo({ top: 0, left: 0, behavior: "smooth" });
          }}
        >
          <FontAwesomeIcon icon={faAngleUp} />
        </button>
      </div>
    </SkeletonLayout>
  );
}
