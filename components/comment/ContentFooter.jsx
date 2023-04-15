import React, { useReducer, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "../../styles/comment/ContentFooter.module.css";
import {
  faCommentAlt,
  faHandsClapping,
  faShareSquare,
  faThumbsDown,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getCountFromServer,
  updateDoc,
} from "firebase/firestore";
import CommentContainer from "./CommentContainer";
import { useAuth } from "../../context/AuthProvider";
import { blogsCollection, handleFirestoreErrors } from "../../firebase";
import { showErrorToast } from "../skeleton-layout/ToasComponent";
import useArray from "../../hooks/useArray";
import { toast } from "react-toastify";
import ShareButton from "../actions/ShareButton";
import { CircleSeparator } from "../article/ArticleContainer";

export function quillDeltaToString(delta) {
  return delta.ops
    .map(function (op) {
      if (typeof op.insert !== "string") return "";
      let html = op.insert;
      return html;
    })
    .join("");
}

function ContentFooter({ pub, commentShown, blog }) {
  const router = useRouter();
  const { currentUser } = useAuth();

  const [openComment, setOpenComment] = useState(commentShown);

  const {
    array: likes,
    set: setLikes,
    push: addLike,
    remove: deleteLike,
  } = useArray(pub.likes || []);
  const {
    array: claps,
    set: setClaps,
    push: addClap,
    remove: deleteClap,
  } = useArray(pub.claps || []);

  const hasLiked =
    currentUser && typeof likes.find((l) => l == currentUser.uid) === "string";
  const hasClapped =
    currentUser && typeof claps.find((c) => c == currentUser.uid) === "string";

  const [nbComments, setNbComments] = useState(0);
  const [shares, setShares] = useState(0);

  function handleLike() {
    if (!currentUser) return;

    /** Si l'utilisateur avait déjà liker la publication, resitrer son like */
    if (hasLiked) {
      toast.promise(
        updateDoc(doc(blogsCollection, router.query.blogId, "posts", pub.id), {
          likes: arrayRemove(currentUser.uid),
        }),
        {
          pending: "Retrait de la mention j'aime...",
          success: "Mention j'aime retirée",
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
      updateDoc(doc(blogsCollection, router.query.blogId, "posts", pub.id), {
        likes: arrayUnion(currentUser.uid),
      }),
      {
        pending: "Ajout de la mention j'aime...",
        success: "Mention j'aime ajoutée",
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
    if (!currentUser) return;

    /** Si l'utilisateur avait déjà applaudit la publication, resitrer son like */
    if (hasClapped) {
      toast.promise(
        updateDoc(doc(blogsCollection, router.query.blogId, "posts", pub.id), {
          claps: arrayRemove(currentUser.uid),
        }),
        {
          pending: "Retrait de la mention bravo en cours...",
          success: "Mention bravo retirée",
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
      updateDoc(doc(blogsCollection, router.query.blogId, "posts", pub.id), {
        claps: arrayUnion(currentUser.uid),
      }),
      {
        pending: "Ajout de la mention bravo en cours...",
        success: "Mention bravo ajoutée",
        error: {
          render({ data }) {
            return handleFirestoreErrors(data);
          },
        },
      }
    );
    return addClap(currentUser.uid);
  }

  useEffect(() => {
    if (!pub || typeof router.query.blogId !== "string") return;

    getCountFromServer(
      collection(
        blogsCollection,
        router.query.blogId,
        "posts",
        pub.id,
        "comments"
      )
    ).then((snap) => {
      setNbComments(snap.data().count);
    });
  }, [pub, router.query.blogId]);

  return (
    <div className={styles.foot_container}>
      <div className={styles.statistics}>
        <div className={styles.stats_items}>
          <span>J'aime</span>
          <CircleSeparator />
          <span>{likes.length >= 10 ? likes.length : `0${likes.length}`}</span>
        </div>
        <div className={styles.stats_items}>
          <span>Bravos</span>
          <CircleSeparator />
          <span>{claps.length >= 10 ? claps.length : `0${claps.length}`}</span>
        </div>
        <div className={styles.stats_items}>
          <span>Commentaires</span>
          <CircleSeparator />
          <span>{nbComments >= 10 ? nbComments : `0${nbComments}`}</span>
        </div>
      </div>
      <div className={styles.foot}>
        <button
          className={styles.like}
          data-active={hasLiked}
          onClick={handleLike}
        >
          <FontAwesomeIcon icon={faThumbsUp} />
          <span>{"J'aime"}</span>
        </button>

        <button
          className={styles.clap}
          data-active={hasClapped}
          onClick={handleClap}
        >
          <FontAwesomeIcon icon={faHandsClapping} />
          <span>Bravo</span>
        </button>

        <button onClick={() => setOpenComment(!openComment)}>
          <FontAwesomeIcon icon={faCommentAlt} />
          <span>Commenter</span>
        </button>

        <ShareButton
          popupOnTop={true}
          generateOnClick={true}
          metas={[
            {
              property: 'property="og:title"',
              value: `${blog.name} - publication`,
            },
            {
              property: 'property="og:description"',
              value: quillDeltaToString(JSON.parse(pub.content)),
            },
            {
              property: 'property="og:image"',
              value: pub.thumbnails[0].downloadURL,
            },
            {
              property: 'property="twitter:title"',
              value: `${blog.name} - publication`,
            },
            {
              property: 'property="twitter:description"',
              value: quillDeltaToString(JSON.parse(pub.content)),
            },
            {
              property: 'property="twitter:image"',
              value: pub.thumbnails[0].downloadURL,
            },
          ]}
        />
      </div>
      {openComment && (
        <CommentContainer
          onClose={() => setOpenComment(!openComment)}
          targetRef={collection(blogsCollection, router.query.blogId, "posts")}
          targetId={pub.id}
        />
      )}
    </div>
  );
}
ContentFooter.propTypes = {
  pub: PropTypes.any,
  commentShown: PropTypes.bool,
};

export default ContentFooter;
