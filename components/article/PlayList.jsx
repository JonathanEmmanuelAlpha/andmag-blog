import React from "react";
import PropTypes from "prop-types";
import styles from "../../styles/article/ArticleContainer.module.css";
import { ArticleCardThin } from "../blog/ArticleCard";
import toTimeString from "../../helpers/toTimeString";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faPlayCircle,
  faShare,
} from "@fortawesome/free-solid-svg-icons";
import { CircleSeparator } from "./ArticleContainer";
import Link from "next/link";
import AwesomeLink from "../links/AwesomeLink";
import EditLink from "../links/EditLink";
import { useRouter } from "next/router";
import { useTargetBlog } from "../../context/BlogProvider";

export function PlayListFull({ playlist, articles, totalReaders }) {
  return (
    <div className={styles.playlist}>
      <div className={styles.playlist_info}>
        <h2>{playlist.name}</h2>
        <div>
          <span>{articles.length} articles</span>
          <span>{totalReaders} lecteurs</span>
        </div>
      </div>
      <div className={styles.playlist_list}>
        {articles.map((article, index) => (
          <ArticleCardThin
            key={index}
            postId={article.id}
            title={article.title}
            reads={article.readers}
            thumbnail={article.thumbnail}
            at={toTimeString(article.createAt)}
          />
        ))}
      </div>
    </div>
  );
}
PlayListFull.propTypes = {
  post: PropTypes.any.isRequired,
  playlist: PropTypes.any.isRequired,
  playlistPosts: PropTypes.any.isRequired,
  totalReaders: PropTypes.number,
};

export function PlayList({ blog, playlist, totalReaders }) {
  const router = useRouter();
  const { isOwner } = useTargetBlog();
  return (
    <div className={styles.playlist_wrapper}>
      {isOwner && (
        <EditLink
          top={"1px"}
          right="1px"
          url={`/blogs/${router.query.blogId}/playlists/add?channel=${playlist.id}`}
        />
      )}
      <div className={styles.head}>
        <div className={styles.thumb}>
          <img src={playlist.thumbnail} alt={playlist.name} />
        </div>
        <div className={styles.infos}>
          <h2>{playlist.name}</h2>
          <div className={styles.stats}>
            <span>
              {playlist.articles ? playlist.articles.length : 0} articles
            </span>
            <CircleSeparator />
            <span>{totalReaders} lecteurs</span>
          </div>
          <div className={styles.mod}>
            <span>
              Modifier le{" "}
              {playlist.updateAt
                ? new Date(
                    playlist.updateAt.seconds * 1000
                  ).toLocaleDateString()
                : new Date(
                    playlist.createAt.seconds * 1000
                  ).toLocaleDateString()}
            </span>
          </div>
          <div className={styles.btns}>
            <button data-favorite-statut>
              <FontAwesomeIcon icon={faHeart} />
              <span>Favoris</span>
            </button>
            <button>
              <FontAwesomeIcon icon={faShare} />
              <span>Partarger</span>
            </button>
          </div>
          <div className={styles.playlist_link}>
            <AwesomeLink
              direction="horizontal"
              icon={faPlayCircle}
              text="Consulter les articles"
              url={`/blogs/${blog.id}/playlists?list=${playlist.id}`}
              reverse
            />
          </div>
        </div>
      </div>
      <p>{playlist.description}</p>
    </div>
  );
}
PlayList.propTypes = {
  blog: PropTypes.any.isRequired,
  playlist: PropTypes.any.isRequired,
  totalReaders: PropTypes.number,
};
