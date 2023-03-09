import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import Image from "next/image";
import styles from "../../styles/blog/ArticleCard.module.css";
import toTimeString from "../../helpers/toTimeString";
import { CircleSeparator } from "../article/ArticleContainer";
import { domainName } from "../links/AwesomeLink.type";
import EditLink from "../links/EditLink";
import { useAuth } from "../../context/AuthProvider";
import { useTargetBlog } from "../../context/BlogProvider";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import dashify from "dashify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

export function ArticleCardThin(props) {
  return (
    <Link href={`/posts/${dashify(props.title)}-${props.postId}`}>
      <a className={styles.card_thin}>
        <Skeleton />
        {props.thumbnail ? (
          <img src={props.thumbnail} alt={props.title + ".thumbnail"} />
        ) : (
          <Skeleton height={100} width={150} />
        )}
        <div className={styles.card_thin_inf}>
          <h2>{props.title || <Skeleton />}</h2>
          <div className={styles.card_thin_info}>
            <span className={styles.span}>
              {props.reads ? props.reads : 0} lecteurs
            </span>
            <span>{props.at}</span>
          </div>
        </div>
      </a>
    </Link>
  );
}
ArticleCardThin.propTypes = {
  postId: PropTypes.string,
  title: PropTypes.string,
  thumbnail: PropTypes.string,
  reads: PropTypes.number,
  at: PropTypes.string,
};

export function ArticleCard({
  blogId,
  createBy,
  articleId,
  thumbnail,
  blogUrl,
  blogLogo,
  blogName,
  title,
  reads,
  at,
  desc,
  tags,
}) {
  const { currentUser } = useAuth();
  const { isOwner } = useTargetBlog();
  return (
    <div className={styles.card}>
      {isOwner && createBy === currentUser?.uid && (
        <EditLink
          url={`/blogs/${blogId}/articles/add?channel=${articleId}`}
          top={"1px"}
          right={"1px"}
        />
      )}
      <div className={styles.wrapper}>
        <header>
          <div className={styles.logo}>
            <img className="skeleton" src={blogLogo} alt={blogName + ".logo"} />
            <Link href={`${domainName}/blogs/${blogId}`}>{blogName}</Link>
          </div>
          <div className={styles.tags}>
            {tags && <span>{tags[0]}</span>}
            {tags && <span>{tags[1]}</span>}
            {tags && <span>{tags[2]}</span>}
          </div>
        </header>
        <span className={styles.title}>{title}</span>
        <p>{desc}</p>
        <div className={styles.foot}>
          <div className={styles.stats}>
            <span>{toTimeString(at.seconds * 1000)}</span>
            <CircleSeparator />
            <span>
              {reads < 10 ? `0${reads} lectures` : `${reads} lectures`}
            </span>
          </div>
          <Link href={`${domainName}/articles/${dashify(title)}-${articleId}`}>
            <a className={styles.read_link}>
              Lire l'article
              <FontAwesomeIcon icon={faArrowRight} />
            </a>
          </Link>
        </div>
      </div>
      <img className="skeleton" src={thumbnail} alt={title + ".thumbnail"} />
    </div>
  );
}
