import React from "react";
import PropTypes from "prop-types";
import styles from "../../styles/article/ArticleContainer.module.css";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowAltCircleLeft,
  faArrowAltCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import dashify from "dashify";

function PageNavigation({ article, articles }) {
  function getNextElement(array = [], target) {
    const currentIndex = array.findIndex((value, index) => value.id === target);
    const nextPost = articles.find(
      (value, index) => index === currentIndex + 1
    );
    return nextPost;
  }
  function getPevElement(array = [], target) {
    const currentIndex = array.findIndex((value, index) => value.id === target);
    const prevPost = articles.find(
      (value, index) => index === currentIndex - 1
    );
    return prevPost;
  }

  const next = getNextElement(articles, article.id);
  const prev = getPevElement(articles, article.id);

  return (
    <div className={styles.page_nav}>
      {prev && (
        <Link
          href={`/articles/${dashify(prev.title, { condense: true })}-${
            prev.id
          }`}
        >
          <a title={prev?.title} className={styles.prev_link}>
            <FontAwesomeIcon icon={faArrowAltCircleLeft} />
            <span>Précédent</span>
          </a>
        </Link>
      )}
      {next && (
        <Link
          href={`/articles/${dashify(next.title, { condense: true })}-${
            next.id
          }`}
        >
          <a title={next?.title} className={styles.next_link}>
            <span>Suivant</span>
            <FontAwesomeIcon icon={faArrowAltCircleRight} />
          </a>
        </Link>
      )}
    </div>
  );
}
PageNavigation.propTypes = {
  article: PropTypes.any.isRequired,
  articles: PropTypes.any.isRequired,
};

export default PageNavigation;
