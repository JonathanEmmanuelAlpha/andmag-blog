import React, { useReducer, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "../../styles/comment/ContentFooter.module.css";
import {
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
  updateDoc,
} from "firebase/firestore";
import CommentContainer from "./CommentContainer";
import { useAuth } from "../../context/AuthProvider";
import { blogsCollection, handleFirestoreErrors } from "../../firebase";
import { showErrorToast } from "../skeleton-layout/ToasComponent";
import useArray from "../../hooks/useArray";
import { toast } from "react-toastify";
import ShareButton from "../actions/ShareButton";

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

  const hasLiked = typeof likes.find((l) => l == currentUser.uid) === "string";
  const hasClapped =
    typeof claps.find((c) => c == currentUser.uid) === "string";

  function handleLike() {
    /** Si l'utilisateur avait déjà liker la publication, resitrer son like */
    if (hasLiked) {
      toast.promise(
        updateDoc(doc(blogsCollection, router.query.blogId, "posts", pub.id), {
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
      updateDoc(doc(blogsCollection, router.query.blogId, "posts", pub.id), {
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
        updateDoc(doc(blogsCollection, router.query.blogId, "posts", pub.id), {
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
      updateDoc(doc(blogsCollection, router.query.blogId, "posts", pub.id), {
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
    <div className={styles.foot_container}>
      <div className={styles.foot}>
        <div>
          <button
            className={styles.like}
            data-active={hasLiked}
            onClick={handleLike}
          >
            <FontAwesomeIcon icon={faThumbsUp} />
            <span>{likes.length > 0 ? likes.length : "J'aime"}</span>
          </button>
          <button
            className={styles.clap}
            data-active={hasClapped}
            onClick={handleClap}
          >
            <FontAwesomeIcon icon={faHandsClapping} />
            <span>{claps.length > 0 ? claps.length : "Bravo"}</span>
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
                property: 'property="og:image"',
                value: pub.thumbnails[0].downloadURL,
              },
              {
                property: 'property="twitter:title"',
                value: `${blog.name} - publication`,
              },
              {
                property: 'property="twitter:image"',
                value: pub.thumbnails[0].downloadURL,
              },
            ]}
          />
        </div>
        <div>
          <button
            className={styles.com_btn}
            onClick={() => setOpenComment(!openComment)}
          >
            {!openComment
              ? "Afficher les commentaires"
              : "Masquer les commentaires"}
          </button>
        </div>
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
