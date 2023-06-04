import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import styles from "../../styles/trainning/TrainningCard.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
import { CircleSeparator } from "../../components/article/ArticleContainer";
import { useAuth } from "../../context/AuthProvider";
import EditLink from "../links/EditLink";
import { domainName } from "../links/AwesomeLink.type";
import { useTargetBlog } from "../../context/BlogProvider";

function TrainningCard({ trainning }) {
  const { currentUser } = useAuth();
  const { isOwner } = useTargetBlog();

  return (
    <a className={styles.container}>
      {isOwner && trainning.createBy === currentUser?.uid && (
        <EditLink
          url={`/blogs/${trainning.blogId}/trainnings/add?channel=${trainning.id}`}
          top={"10px"}
          right={"30px"}
        />
      )}
      <div className={styles.wrapper}>
        <h1>{trainning.title}</h1>
        <div className={styles.infos_1}>
          <span className={styles.lev}>
            <strong>{trainning.target}</strong>
          </span>
          <CircleSeparator />
          <span className={styles.sk}>
            <strong>{trainning.questionsNumber || 0} questions</strong>
          </span>
          <CircleSeparator />
          <span>
            <strong>{trainning.participants || 0} participants</strong>
          </span>
          <CircleSeparator />
          <span>
            <strong>{trainning.time} min</strong>
          </span>
        </div>
      </div>
      <p>{trainning.description.slice(0, 124)}</p>
      {trainning.published && (
        <Link
          href={`${domainName}/trainnings/train?testChannel=${trainning.id}`}
        >
          {"S'entrainner"}
        </Link>
      )}
      {false ? (
        <div className={styles.statut}>
          <FontAwesomeIcon icon={faStar} />
          <span>99 %</span>
        </div>
      ) : (
        <div className={styles.star}>
          <FontAwesomeIcon icon={faStar} />
        </div>
      )}
    </a>
  );
}

export default TrainningCard;
