import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styles from "../../styles/article/ArticleContainer.module.css";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShare,
  faStar,
  faThumbsDown,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import { CircleSeparator } from "./ArticleContainer";
import toTimeString from "../../helpers/toTimeString";
import { useAuth } from "../../context/AuthProvider";

function Header({ article, blog }) {
  const { currentUser } = useAuth();

  const [readers, setReaders] = useState(0);
  const [likeStatut, setLikeStatut] = useState("");
  const [favoriteStatut, setFavoriteStatut] = useState("");

  /** Add evry user that stay on this page during more than 2min to readers */
  useEffect(() => {
    if (!article) return;

    setReaders((prev) => {
      if (article.readers) return article.readers.length;
      return prev;
    });

    const timeout = setTimeout(async () => {}, 1000 * 60 * 2);

    return () => {
      clearTimeout(timeout);
    };
  }, [article]);

  /** GET LIKE/DISLIKE AND FAVORITE STATUT */
  useEffect(() => {}, [article]);

  async function updateLikeDislikeSystem(statut) {}

  async function updateFavoriteSystem() {}

  return (
    <div className={styles.header}>
      <div
        className={styles.thumb}
        style={{ backgroundImage: `url(${article.thumbnail})` }}
      />
      <div className={styles.infos}>
        <h1>{article.title}</h1>
        <div className={styles.post_view}>
          <span>{readers} readers</span>
          <CircleSeparator />
          <span>{toTimeString(article.createAt.seconds * 1000 || 1000)}</span>
        </div>
        <div className={styles.btns}>
          <button
            onClick={async () => await updateLikeDislikeSystem("LIKE_CLICKED")}
            data-like-statut={likeStatut}
          >
            <FontAwesomeIcon icon={faThumbsUp} />
            {article && article.usersLiked?.length > 0 ? (
              <span>{article.usersLiked.length}</span>
            ) : (
              <span>Like</span>
            )}
          </button>
          <button
            onClick={async () =>
              await updateLikeDislikeSystem("DISLIKE_CLICKED")
            }
            data-dislike-statut={likeStatut}
          >
            <FontAwesomeIcon icon={faThumbsDown} />
            {article && article.usersDisliked?.length > 0 ? (
              <span>{article.usersDisliked.length}</span>
            ) : (
              <span>Dislike</span>
            )}
          </button>
          <button
            onClick={async () => await updateFavoriteSystem()}
            data-favorite-statut={favoriteStatut}
          >
            <FontAwesomeIcon icon={faStar} />
            {article && article.usersFavorite?.length > 0 ? (
              <span>{article.usersFavorite.length}</span>
            ) : (
              <span>Favorites</span>
            )}
          </button>
          <button>
            <FontAwesomeIcon icon={faShare} />
            <span>Share</span>
          </button>
        </div>
      </div>
      <div className={styles.action}>
        <Link href={`/blogs/${blog.id}`}>
          <a className={styles.left}>
            <Image src={blog.logo} width={50} height={50} />
            <div>
              <h2>{blog.name}</h2>
              <span>
                {blog.followers ? blog.followers.length : 0} followers
              </span>
            </div>
          </a>
        </Link>
        <div className={styles.right}>
          {blog.followers?.includes(currentUser.uid) ? (
            <button>Unsubscribe</button>
          ) : (
            <button>Subscribe</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
