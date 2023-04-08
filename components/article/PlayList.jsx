import React, { useState } from "react";
import styles from "../../styles/article/ArticleContainer.module.css";
import { ArticleCardThin } from "../blog/ArticleCard";
import toTimeString from "../../helpers/toTimeString";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faAngleUp,
  faPlayCircle,
} from "@fortawesome/free-solid-svg-icons";
import { CircleSeparator } from "./ArticleContainer";
import Link from "next/link";
import AwesomeLink from "../links/AwesomeLink";
import EditLink from "../links/EditLink";
import { useRouter } from "next/router";
import { useTargetBlog } from "../../context/BlogProvider";
import ShareButton from "../actions/ShareButton";
import { domainName } from "../links/AwesomeLink.type";
import LoadingScreen from "../inputs/LoadingScreen";
import Image from "next/image";

export function PlayListFull({
  playlist,
  articles,
  totalReaders,
  mobileDevice,
  loading,
}) {
  const [toggle, setToggle] = useState(false);

  if (mobileDevice && typeof window !== "undefined" && window.outerWidth > 1200)
    return null;

  if (
    !mobileDevice &&
    typeof window !== "undefined" &&
    window.outerWidth <= 1200
  )
    return null;

  return (
    <div
      className={styles.playlist}
      data-device={mobileDevice ? "mobile" : "computer"}
      data-mobile-active={toggle && mobileDevice}
    >
      <div className={styles.playlist_info}>
        <h2>{playlist.name}</h2>
        <div>
          <span>{articles.length} articles</span>
          <span>{totalReaders} lecteurs</span>
        </div>
        {mobileDevice && (
          <button
            className={styles.toggle_btn}
            onClick={() => setToggle(!toggle)}
          >
            {!toggle ? (
              <>
                <span>Afficher</span>
                <FontAwesomeIcon icon={faAngleDown} />
              </>
            ) : (
              <>
                <span>Masquer</span>
                <FontAwesomeIcon icon={faAngleUp} />
              </>
            )}
          </button>
        )}
      </div>
      <div className={styles.playlist_list}>
        {loading ? (
          <LoadingScreen />
        ) : (
          articles.map((article, index) => (
            <ArticleCardThin
              key={index}
              postId={article.id}
              title={article.title}
              reads={article.readers}
              thumbnail={article.thumbnail}
              at={toTimeString(article.createAt)}
            />
          ))
        )}
      </div>
    </div>
  );
}

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
          <Image
            className="skeleton"
            src={playlist.thumbnail}
            alt={playlist.name + " - thumbnail"}
            priority
            layout="fill"
          />
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
            <ShareButton
              generateOnClick={true}
              metas={[
                { property: 'property="og:title"', value: playlist.name },
                {
                  property: 'property="og:description"',
                  value: playlist.description,
                },
                {
                  property: 'property="og:url"',
                  value: `${domainName}/blogs/${blog.id}/playlists?list=${playlist.id}`,
                },
                { property: 'property="og:image"', value: playlist.thumbnail },
                { property: 'property="twitter:title"', value: playlist.name },
                {
                  property: 'property="twitter:description"',
                  value: playlist.description,
                },
                {
                  property: 'property="twitter:url"',
                  value: `${domainName}/blogs/${blog.id}/playlists?list=${playlist.id}`,
                },
                {
                  property: 'property="twitter:image"',
                  value: playlist.thumbnail,
                },
              ]}
            />
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
