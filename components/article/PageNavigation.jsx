import React from "react";
import PropTypes from "prop-types";
import styles from "../../styles/article/ArticleContainer.module.css";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowAltCircleLeft,
  faArrowAltCircleRight,
} from "@fortawesome/free-solid-svg-icons";

function PageNavigation({ article, articles }) {
  if (!articles || articles.length <= 1) return null;

  function getNextElement(array = [], target) {
    const currentIndex = array.findIndex(
      (value, index) => value._id === target
    );
    const nextPost = articles.find((value, index) => index === currentIndex);
    return nextPost;
  }
  function getPevElement(array = [], target) {
    const currentIndex = array.findIndex(
      (value, index) => value._id === target
    );
    const prevPost = articles.find((value, index) => index === currentIndex);
    return prevPost;
  }

  const next = getNextElement(articles, article.id);
  const prev = getPevElement(articles, article.id);

  return (
    <div className={styles.page_nav}>
      <Link href={`/articles/${prev?.title}-${prev?.id}`}>
        <a title={prev?.title} className={styles.prev_link}>
          <FontAwesomeIcon icon={faArrowAltCircleLeft} />
          <span>Précédent</span>
        </a>
      </Link>
      <Link href={`/articles/${next?.title}-${next?.id}`}>
        <a title={next?.title} className={styles.next_link}>
          <span>Suivant</span>
          <FontAwesomeIcon icon={faArrowAltCircleRight} />
        </a>
      </Link>
    </div>
  );
}
PageNavigation.propTypes = {
  article: PropTypes.any.isRequired,
  articles: PropTypes.any.isRequired,
};

export default PageNavigation;
