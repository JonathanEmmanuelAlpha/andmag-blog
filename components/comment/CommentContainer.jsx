import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import styles from "../../styles/comment/CommentItem.module.css";
import CommentItem from "./CommentItem";
import dynamic from "next/dynamic";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import CommentInput from "./CommentInput";
import Alert from "../inputs/Alert";
import { useAuth } from "../../context/AuthProvider";
import { showErrorToast } from "../skeleton-layout/ToasComponent";
import { handleFirestoreErrors } from "../../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

function ReturnButton({ onClick }) {
  return (
    <div className={styles.ret_btn}>
      <button onClick={onClick}>
        <FontAwesomeIcon icon={faArrowLeft} />
        <span>Retour</span>
      </button>
    </div>
  );
}

function CommentContainer({ targetId, targetRef, isOpen, onClose }) {
  const { currentUser } = useAuth();

  const [comments, setComments] = useState([]);
  const rootComments = comments.filter((comment) => comment.parentId === null);
  const responses = comments.filter((comment) => comment.parentId !== null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /** Connect to targetId channel and listen to all comments change */
  useEffect(() => {
    if (!targetId || !targetRef) return;

    const q = query(
      collection(targetRef, targetId, "comments"),
      orderBy("createAt")
    );
    const unsubscriber = onSnapshot(q, (querySnapshot) => {
      setComments([]);
      querySnapshot.docChanges().forEach((change) => {
        setComments((prev) => {
          if (change.type === "modified") return prev;

          if (prev.find((c) => c.id === change.doc.id)) return prev;
          return [{ id: change.doc.id, ...change.doc.data() }, ...prev];
        });
      });
    });

    return unsubscriber;
  }, [targetId, targetRef]);

  async function postComment(content) {
    if (!currentUser) {
      throw new Error("User is unauthenticated, please login and try again.");
      return;
    }
    if (!currentUser.photoURL || !currentUser.displayName) {
      throw new Error(
        "Please go to settings page and add a pseudo and a profile picture then, try again."
      );
      return;
    }

    const comment = {
      userName: currentUser.displayName,
      userPP: currentUser.photoURL,
      parentId: null,
      content: content,
      createAt: serverTimestamp(),
    };

    return await addDoc(collection(targetRef, targetId, "comments"), comment);
  }

  async function responseComment(commentId, content) {
    if (!currentUser) {
      throw new Error("User is unauthenticated, please login and try again.");
      return;
    }
    if (!currentUser.photoURL || !currentUser.displayName) {
      throw new Error(
        "Please go to settings page and add a pseudo and a profile picture then, try again."
      );
      return;
    }

    const comment = {
      userName: currentUser.displayName,
      userPP: currentUser.photoURL,
      parentId: commentId,
      content: content,
      createAt: serverTimestamp(),
    };

    return await addDoc(collection(targetRef, targetId, "comments"), comment);
  }

  return (
    <div className={styles.com_container}>
      <ReturnButton onClick={onClose} />
      <div className={styles.add_comment}>
        {error && <Alert type="danger" message={error} />}
        {currentUser && (
          <CommentInput
            handlePost={async (content) => {
              setLoading(true);
              try {
                await postComment(content);
              } catch (error) {
                setError((prev) => {
                  return error.message;
                });
              }
              setLoading(false);
            }}
          />
        )}
      </div>
      {comments?.length <= 0
        ? null
        : rootComments?.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              collectionRoot={targetRef}
              targetId={targetId}
              responseComment={async (id, content) => {
                try {
                  await responseComment();
                } catch (error) {
                  showErrorToast(handleFirestoreErrors(error));
                }
              }}
            >
              {responses?.map((response) => {
                if (response.parentId === comment.id) {
                  return (
                    <CommentItem
                      isAnswer
                      key={response.id}
                      comment={response}
                      collectionRoot={targetRef}
                      targetId={targetId}
                      responseComment={async (id, content) => {
                        try {
                          await responseComment(id, content);
                        } catch (error) {
                          showErrorToast(handleFirestoreErrors(error));
                        }
                      }}
                    />
                  );
                }
              })}
            </CommentItem>
          ))}
    </div>
  );
}

export default CommentContainer;
