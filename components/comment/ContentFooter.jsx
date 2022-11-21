import React, { useReducer, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "../../styles/comment/ContentFooter.module.css";
import {
  faComments,
  faHandsClapping,
  faShareSquare,
  faThumbsDown,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import { arrayRemove, collection, updateDoc } from "firebase/firestore";
import CommentContainer from "./CommentContainer";
import { useAuth } from "../../context/AuthProvider";
import { blogsCollection } from "../../firebase";

const ACTIONS = {
  LIKE: "LIKE",
  DEFAULT: "DEFAULT",
};

const TYPE = {
  LOAD: "LOAD",
  ADD_LIKE: "ADD_LIKE",
  RESET_LIKE: "RESET_LIKE",
};

function getStatut(id, likes, claps) {
  if (likes && likes.includes(id)) return ACTIONS.LIKE;
  return ACTIONS.DEFAULT;
}

function reducer(state, { type, payload }) {
  switch (type) {
    case TYPE.LOAD:
      const statut = getStatut(payload.userId, payload.likes, payload.claps);
      return {
        likes: payload.likes ? payload.likes.length : 0,
        claps: payload.claps ? payload.claps.length : 0,
        statut: statut,
      };

    case TYPE.ADD_LIKE:
      return {
        likes: payload.likes.length + 1,
        claps: payload.claps.length,
        statut: ACTIONS.LIKE,
      };

    case TYPE.RESET_LIKE:
      return {
        likes: payload.likes.length - 1,
        claps: payload.claps.length,
        statut: ACTIONS.DEFAULT,
      };

    default:
      break;
  }
}

function ContentFooter({ pub, commentShown }) {
  const router = useRouter();
  const { currentUser } = useAuth();

  const [openComment, setOpenComment] = useState();

  const [state, dispatch] = useReducer(reducer, {
    likes: 0,
    claps: 0,
    statut: ACTIONS.DEFAULT,
  });

  useEffect(() => {
    if (!pub) return;

    setOpenComment(commentShown);

    dispatch({
      type: TYPE.LOAD,
      payload: { userId: currentUser ? currentUser.uid : null, ...pub },
    });
  }, [pub, commentShown]);

  async function handleLike() {
    if (!pub.likes.includes(currentUser.uid)) {
      try {
        await updateDoc(doc(publicationsRef, pub.id), {
          likes: [...pub.likes, currentUser.uid],
        });
        dispatch({
          type: TYPE.ADD_LIKE,
          payload: { userId: currentUser.uid, ...pub },
        });
      } catch (error) {
        console.log(`Like of ${pub.id} => ${error}`);
      }
      return;
    }

    if (pub.likes.includes(currentUser.uid)) {
      try {
        await updateDoc(doc(publicationsRef, pub.id), {
          likes: arrayRemove(currentUser.uid),
        });
        dispatch({
          type: TYPE.RESET_LIKE,
          payload: { userId: currentUser.uid, ...pub },
        });
      } catch (error) {
        console.log(`Like of ${pub.id} => ${error}`);
      }
      return;
    }
  }

  return (
    <div className={styles.foot_container}>
      <div className={styles.foot}>
        <div>
          <button disabled={true}>
            <FontAwesomeIcon icon={faComments} />
            <span>{0}</span>
          </button>
          <button
            className={styles.like}
            data-active={state.statut === ACTIONS.LIKE}
            onClick={handleLike}
          >
            <FontAwesomeIcon icon={faThumbsUp} />
            <span>{state.likes === 0 ? "J'aime" : state.likes}</span>
          </button>
          <button>
            <FontAwesomeIcon icon={faHandsClapping} />
            <span>{0}</span>
          </button>
        </div>
        <div>
          <button onClick={() => setOpenComment(!openComment)}>comment</button>
          <button>
            <FontAwesomeIcon icon={faShareSquare} />
          </button>
        </div>
      </div>
      <CommentContainer
        isOpen={openComment}
        targetRef={collection(blogsCollection, router.query.blogId, "posts")}
        targetId={pub.id}
      />
    </div>
  );
}
ContentFooter.propTypes = {
  pub: PropTypes.any,
  commentShown: PropTypes.bool,
};

export default ContentFooter;
