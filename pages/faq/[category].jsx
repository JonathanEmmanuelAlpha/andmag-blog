import { faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import styles from "../../styles/faq/base.module.css";
import SkeletonLayout from "../../components/skeleton-layout/SkeletonLayout";
import FaqMenu from "../../components/faq/FaqMenu";
import { useRouter } from "next/router";
import { CATEGORIES } from "./add";
import dashify from "dashify";
import { useFAQ } from "../../context/FAQProvider";
import dynamic from "next/dynamic";

const QuillContent = dynamic(
  () => import("../../components/article/QuillContent"),
  { ssr: false }
);

function FAQContent({ target }) {
  return (
    <div className={styles.faq_content}>
      <h2>{target.name}</h2>
      <QuillContent delta={JSON.parse(target.content)} />
    </div>
  );
}

export default function Category() {
  const router = useRouter();
  const { loadingItems, getCategoryItem } = useFAQ();
  const items = getCategoryItem(router.query.category);

  return (
    <SkeletonLayout
      title="Fréquement demandée"
      description="Vous avez des préoccupations par rapport à certains points ? Consulter la faq pour dissiper tous vos doutes."
    >
      <div className={styles.container}>
        <FaqMenu />
        <section className={styles.section}>
          <h1>
            {
              CATEGORIES.find(
                (cat) => dashify(cat.type) === router.query.category
              )?.name
            }
          </h1>
          {items.map((item) => {
            return <FAQContent key={item.id} target={item} />;
          })}
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
