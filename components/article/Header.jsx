import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styles from "../../styles/article/ArticleContainer.module.css";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHandsClapping,
  faShare,
  faStar,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import { CircleSeparator } from "./ArticleContainer";
import toTimeString from "../../helpers/toTimeString";
import { useAuth } from "../../context/AuthProvider";
import {
  arrayRemove,
  arrayUnion,
  doc,
  increment,
  updateDoc,
} from "firebase/firestore";
import {
  articlesCollection,
  handleFirestoreErrors,
  profilesCollection,
} from "../../firebase";
import useBlogFollowers from "../../hooks/useBlogFollowers";
import { SubButton } from "../blog/BlogHead";
import { toast } from "react-toastify";
import useArray from "../../hooks/useArray";
import ShareButton from "../actions/ShareButton";
import { useRouter } from "next/router";

const INTERVAL = 1000 * 30;

function Header({ article, blog }) {
  const router = useRouter();

  const { currentUser, userProfile } = useAuth();

  const followers = useBlogFollowers(blog.id);

  const [readers, setReaders] = useState(0);

  const {
    array: likes,
    set: setLikes,
    push: addLike,
    remove: deleteLike,
  } = useArray(article.likes || []);

  const {
    array: claps,
    set: setClaps,
    push: addClap,
    remove: deleteClap,
  } = useArray(article.claps || []);

  const {
    array: favorites,
    set: setFavorites,
    push: addFavorite,
    remove: deleteFavorite,
  } = useArray(article.favorites || []);

  const hasLiked = typeof likes.find((l) => l == currentUser?.uid) === "string";
  const hasClapped =
    typeof claps.find((c) => c == currentUser?.uid) === "string";
  const isFavorite =
    typeof favorites.find((f) => f == currentUser?.uid) === "string";

  function handleLike() {
    /** Si l'utilisateur avait déjà liker la publication, resitrer son like */
    if (hasLiked) {
      toast.promise(
        updateDoc(doc(articlesCollection, router.query.articleId), {
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
      updateDoc(doc(articlesCollection, router.query.articleId), {
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
        updateDoc(doc(articlesCollection, router.query.articleId), {
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
      updateDoc(doc(articlesCollection, router.query.articleId), {
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

  async function addFavoriteHandler() {
    try {
      await updateDoc(doc(articlesCollection, router.query.articleId), {
        favorites: arrayUnion(currentUser.uid),
      });

      await updateDoc(doc(profilesCollection, userProfile.id), {
        favorites: arrayUnion(article.id),
      });
    } catch (error) {
      return error;
    }
  }

  async function removeFavorite() {
    try {
      await updateDoc(doc(articlesCollection, router.query.articleId), {
        favorites: arrayRemove(currentUser.uid),
      });

      await updateDoc(doc(profilesCollection, userProfile.id), {
        favorites: arrayRemove(article.id),
      });
    } catch (error) {
      return error;
    }
  }

  function handleFavorite() {
    if (isFavorite) {
      toast.promise(removeFavorite(), {
        pending: "Retrait de l'articles des favoris...",
        success: "Article retiré avec succès",
        error: {
          render({ data }) {
            return handleFirestoreErrors(data);
          },
        },
      });

      return deleteFavorite(favorites.indexOf(currentUser.uid));
    }

    /** Ajouter aux favoris */
    toast.promise(addFavoriteHandler(), {
      pending: "Ajout de l'article aux favoris...",
      success: "Article ajouté avec succès",
      error: {
        render({ data }) {
          return handleFirestoreErrors(data);
        },
      },
    });
    return addFavorite(currentUser.uid);
  }

  /** Add evry user that stay on this page during more than 30s to readers */
  useEffect(() => {
    if (!article) return;

    setReaders((prev) => {
      if (article.readers) return article.readers;
      return prev;
    });

    const timeout = setTimeout(async () => {
      updateDoc(doc(articlesCollection, article.id), {
        readers: increment(1),
      }).then(() => {
        setReaders((prev) => prev + 1);
      });
    }, INTERVAL);

    return () => {
      clearTimeout(timeout);
    };
  }, [article]);

  return (
    <div className={styles.header}>
      <div
        className={styles.thumb}
        style={{ backgroundImage: `url(${article.thumbnail})` }}
      />
      <div className={styles.infos}>
        <h1>{article.title}</h1>
        <div className={styles.post_view}>
          <span>{readers} lecteurs</span>
          <CircleSeparator />
          <span>{toTimeString(article.createAt * 1000)}</span>
        </div>
        <div className={styles.btns}>
          <button
            onClick={handleLike}
            data-active={hasLiked}
            className={styles.like_btn}
          >
            <FontAwesomeIcon icon={faThumbsUp} />
            <span>{likes.length > 0 ? likes.length : "J'aime"}</span>
          </button>
          <button
            onClick={handleClap}
            data-active={hasClapped}
            className={styles.clap_btn}
          >
            <FontAwesomeIcon icon={faHandsClapping} />
            <span>{claps.length > 0 ? claps.length : "Bravo"}</span>
          </button>
          <button
            onClick={handleFavorite}
            data-active={isFavorite}
            className={styles.favorite_btn}
          >
            <FontAwesomeIcon icon={faStar} />
            <span>{favorites.length > 0 ? favorites.length : "Favoris"}</span>
          </button>
          <ShareButton popupOnTop={false} />
        </div>
      </div>
      <div className={styles.action}>
        <Link href={`/blogs/${blog.id}`}>
          <a className={styles.left}>
            <Image src={blog.logo} width={50} height={50} />
            <div>
              <h2>{blog.name}</h2>
              <span>{followers ? followers : 0} abonnés</span>
            </div>
          </a>
        </Link>
        <div className={styles.right}>
          <SubButton blog={blog} />
        </div>
      </div>
    </div>
  );
}

export default Header;
