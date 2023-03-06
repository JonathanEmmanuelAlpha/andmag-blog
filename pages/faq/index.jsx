import { faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import styles from "../../styles/faq/base.module.css";
import SkeletonLayout from "../../components/skeleton-layout/SkeletonLayout";
import FaqMenu from "../../components/faq/FaqMenu";
import Link from "next/link";

export default function FAQ() {
  return (
    <SkeletonLayout
      title="Fréquement demandée"
      description="Vous avez des préoccupations par rapport à certains points ? Consulter la faq pour dissiper tous vos doutes."
    >
      <div className={styles.container}>
        <section className={styles.main_sect}>
          <h1>Fréquement demandée</h1>
          <p>
            Vous avez des préoccupations par rapport à certains points ?
            Consulter la faq pour dissiper tous vos doutes.
          </p>
          <div className={styles.links}>
            <Link href="/faq/native-app">
              <a className={styles.left}>Premier élément</a>
            </Link>
            <Link href="/faq/others">
              <a className={styles.right}>Autres élément</a>
            </Link>
          </div>
        </section>
      </div>
    </SkeletonLayout>
  );
}
