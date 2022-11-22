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

export function ArticleCardThin(props) {
  return (
    <Link href={`/posts/${props.postId}`}>
      <a className={styles.card_thin}>
        <Skeleton />
        {props.thumbnail ? (
          <img src={props.thumbnail} />
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
  postId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  thumbnail: PropTypes.string.isRequired,
  reads: PropTypes.number.isRequired,
  at: PropTypes.string.isRequired,
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
}) {
  const { currentUser } = useAuth();
  const { isOwner } = useTargetBlog();
  return (
    <Link href={`${domainName}/articles/${articleId}`}>
      <a className={styles.card}>
        {isOwner && createBy === currentUser?.uid && (
          <EditLink
            url={`/blogs/${blogId}/articles/add?channel=${articleId}`}
            top={"1px"}
            right={"1px"}
          />
        )}
        <div className={styles.header}>
          <img className="skeleton" src={thumbnail} />
        </div>
        <div className={styles.body}>
          <div className={styles.blog_logo}>
            {blogUrl && blogLogo ? (
              <Link href={blogUrl}>
                <a>
                  <Image src={blogLogo} width={60} height={60} />
                </a>
              </Link>
            ) : (
              <Skeleton height={60} width={60} />
            )}
          </div>
          <div className={styles.infos}>
            <h2>{title || <Skeleton />}</h2>
            <div className={styles.stats}>
              {blogUrl && blogName ? (
                <Link href={blogUrl}>{blogName}</Link>
              ) : (
                <Skeleton />
              )}
              <CircleSeparator />
              <span>{reads ? reads : 0} lecteurs</span>
              <CircleSeparator />
              {at ? (
                <span>{toTimeString(at.seconds * 1000)}</span>
              ) : (
                <Skeleton />
              )}
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
}
