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
    <Link
      href={`/articles/${dashify(props.title, {
        condense: true,
      })}-${props.postId}`}
    >
      <a className={styles.card_thin}>
        <Skeleton />
        {props.thumbnail ? (
          <div className={styles.thumb}>
            <Image
              src={props.thumbnail}
              alt={props.title + ".thumbnail"}
              layout="fill"
              priority
            />
          </div>
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
      {currentUser && isOwner && createBy === currentUser.uid && (
        <EditLink
          url={`/blogs/${blogId}/articles/add?channel=${articleId}`}
          top={"1px"}
          right={"1px"}
        />
      )}
      <div className={styles.wrapper}>
        <header>
          {blogLogo ? (
            <Image
              src={blogLogo}
              alt={blogName + ".logo"}
              width={35}
              height={35}
            />
          ) : (
            <Skeleton width={35} height={35} baseColor={"grey"} circle />
          )}
          <div className={styles.infos}>
            <Link href={`${domainName}/blogs/${blogId}`}>
              {blogName || (
                <Skeleton
                  width={175}
                  height={7}
                  borderRadius={7}
                  baseColor={"grey"}
                />
              )}
            </Link>
            <div className={styles.tags}>
              {tags &&
                tags.map(
                  (tag, index) =>
                    index < 5 && (
                      <Link
                        href={`${domainName}/articles/results?search_query=${tag.slice(
                          1,
                          tag.length
                        )}`}
                        key={index}
                      >
                        {tag}
                      </Link>
                    )
                )}
            </div>
          </div>
        </header>
        <span className={styles.title}>{title}</span>
        <p>{desc}</p>
        <div className={styles.foot}>
          <div className={styles.stats}>
            <span>{toTimeString(at.seconds * 1000)}</span>
            <CircleSeparator />
            <span>
              {reads === 1
                ? `0${reads} lecture`
                : reads < 10
                ? `0${reads} lectures`
                : reads
                ? `${reads} lectures`
                : "aucune lecture"}
            </span>
          </div>
          <Link
            href={`${domainName}/articles/${dashify(title, {
              condense: true,
            })}-${articleId}`}
          >
            <a className={styles.read_link}>
              Lire l'article
              <FontAwesomeIcon icon={faArrowRight} />
            </a>
          </Link>
        </div>
      </div>
      <div className={styles.thumb_fill}>
        <Image src={thumbnail} alt={title + ".thumbnail"} layout="fill" />
      </div>
    </div>
  );
}
