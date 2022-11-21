import React, { useState } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faAngleUp,
  faComments,
  faHandsClapping,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import styles from "../../styles/comment/CommentItem.module.css";
import toTimeString from "../../helpers/toTimeString";
import dynamic from "next/dynamic";
import CommentInput from "./CommentInput";
import Alert from "../inputs/Alert";
import { domainName } from "../links/AwesomeLink.type";

function CommentItem({
  isAnswer,
  comment,
  onLike,
  onClap,
  responseComment,
  onShare,
  children,
}) {
  if (!comment) return null;

  const [canResponse, setCanResponse] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleFocusTo(target, responseTo) {
    const input =
      target.parentElement.parentElement.parentElement.parentElement.querySelector(
        "textarea"
      );
    input.value = `${responseTo}, `;
    input.focus();
  }

  return (
    <div
      className={
        !isAnswer ? styles.com_item : `${styles.com_item} ${styles.answer}`
      }
    >
      <div className={styles.ppc}>
        <Image src={comment.userPP} width={40} height={40} />
      </div>
      <div className={styles.cwrp}>
        <div className={styles.chd}>
          <Link href={`${domainName}/profile?pseudo=${comment.userName}`}>
            {comment.userName}
          </Link>
          <span>
            {toTimeString(
              comment.createAt ? comment.createAt.seconds * 1000 : 1000
            )}
          </span>
        </div>
        <div className={styles.cbd}>
          <p>{comment.content}</p>
        </div>
        <div className={styles.cft}>
          <div>
            <button onClick={onClap}>
              <FontAwesomeIcon icon={faComments} />
              <span>1</span>
            </button>
            <button
              className={styles.like_btn}
              onClick={onLike}
              data-like-statut
            >
              <FontAwesomeIcon icon={faThumbsUp} />
              <span>{comment.likes?.length}</span>
            </button>
            <button onClick={onClap}>
              <FontAwesomeIcon icon={faHandsClapping} />
              <span>{comment.claps?.length}</span>
            </button>
          </div>
          {!isAnswer ? (
            <button
              className={styles.com_btn}
              onClick={() => setCanResponse(!canResponse)}
            >
              {!canResponse ? (
                <>
                  <span>show answers</span>
                  <FontAwesomeIcon icon={faAngleDown} />
                </>
              ) : (
                <>
                  <span>hide answers</span>
                  <FontAwesomeIcon icon={faAngleUp} />
                </>
              )}
            </button>
          ) : (
            <button
              className={styles.com_btn}
              onClick={(e) => handleFocusTo(e.target, comment.userName)}
            >
              <span>Répondre</span>
            </button>
          )}
        </div>
        {canResponse ? (
          <div>
            {children}
            <div className={styles.response_form}>
              {error && <Alert type="danger" message={error} />}
              <CommentInput
                handlePost={async (content) => {
                  setLoading(true);
                  try {
                    await responseComment(comment.id, content);
                  } catch (error) {
                    setError((prev) => {
                      return error.message;
                    });
                  }
                  setLoading(false);
                }}
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
CommentItem.propTypes = {
  isAnswer: PropTypes.bool,
  comment: PropTypes.any.isRequired,
  onLike: PropTypes.func,
  onDislike: PropTypes.func,
  onShare: PropTypes.func,
  responseComment: PropTypes.func,
  responses: PropTypes.element,
};

export default CommentItem;
