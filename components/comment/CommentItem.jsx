import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faAngleUp,
  faHandsClapping,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import styles from "../../styles/comment/CommentItem.module.css";
import toTimeString from "../../helpers/toTimeString";
import dynamic from "next/dynamic";
import CommentInput from "./CommentInput";
import Alert from "../inputs/Alert";
import { domainName } from "../links/AwesomeLink.type";
import { handleFirestoreErrors } from "../../firebase";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import useArray from "../../hooks/useArray";
import { useAuth } from "../../context/AuthProvider";

function CommentItem({
  isAnswer,
  comment,
  responseComment,
  collectionRoot,
  targetId,
  children,
}) {
  if (!comment) return null;

  const { currentUser } = useAuth();

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

  const {
    array: likes,
    set: setLikes,
    push: addLike,
    remove: deleteLike,
  } = useArray(comment.likes || []);
  const {
    array: claps,
    set: setClaps,
    push: addClap,
    remove: deleteClap,
  } = useArray(comment.claps || []);

  const hasLiked = typeof likes.find((l) => l == currentUser.uid) === "string";
  const hasClapped =
    typeof claps.find((c) => c == currentUser.uid) === "string";

  function handleLike() {
    /** Si l'utilisateur avait déjà liker la publication, resitrer son like */
    if (hasLiked) {
      toast.promise(
        updateDoc(doc(collectionRoot, targetId, "comments", comment.id), {
          likes: arrayRemove(currentUser.uid),
        }),
        {
          pending: "Retrait de le mention j'aime...",
          success: "Mention j'aime retirer",
          error: {
            render({ data }) {
              return handleFirestoreErrors(data);
            },
          },
        }
      );

      return deleteLike(likes.indexOf(currentUser.uid));
    }

    /** Ajouter un like */
    toast.promise(
      updateDoc(doc(collectionRoot, targetId, "comments", comment.id), {
        likes: arrayUnion(currentUser.uid),
      }),
      {
        pending: "Ajout de le mention j'aime...",
        success: "Mention j'aime ajouter",
        error: {
          render({ data }) {
            return handleFirestoreErrors(data);
          },
        },
      }
    );
    return addLike(currentUser.uid);
  }

  function handleClap() {
    /** Si l'utilisateur avait déjà applaudit la publication, resitrer son like */
    if (hasClapped) {
      toast.promise(
        updateDoc(doc(collectionRoot, targetId, "comments", comment.id), {
          claps: arrayRemove(currentUser.uid),
        }),
        {
          pending: "Retrait de le mention en cours...",
          success: "Mention retirer avec succès",
          error: {
            render({ data }) {
              return handleFirestoreErrors(data);
            },
          },
        }
      );

      return deleteClap(likes.indexOf(currentUser.uid));
    }

    /** Ajouter un bravo */
    toast.promise(
      updateDoc(doc(collectionRoot, targetId, "comments", comment.id), {
        claps: arrayUnion(currentUser.uid),
      }),
      {
        pending: "Ajout de le mention en cours...",
        success: "Mention ajouter avec succès",
        error: {
          render({ data }) {
            return handleFirestoreErrors(data);
          },
        },
      }
    );
    return addClap(currentUser.uid);
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
          <Link
            href={`${domainName}/account/profile?pseudo=${comment.userName}`}
          >
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
            <button
              className={styles.like_btn}
              onClick={handleLike}
              data-active={hasLiked}
            >
              <FontAwesomeIcon icon={faThumbsUp} />
              <span>{likes.length > 0 ? likes.length : "J'aime"}</span>
            </button>
            <button
              className={styles.clap_btn}
              onClick={handleClap}
              data-active={hasClapped}
            >
              <FontAwesomeIcon icon={faHandsClapping} />
              <span>{claps.length > 0 ? claps.length : "Bravo"}</span>
            </button>
          </div>
          {!isAnswer ? (
            <button
              className={styles.com_btn}
              onClick={() => setCanResponse(!canResponse)}
            >
              {!canResponse ? (
                <>
                  <span>Réponses</span>
                  <FontAwesomeIcon icon={faAngleDown} />
                </>
              ) : (
                <>
                  <span>Masquer</span>
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

export default CommentItem;
