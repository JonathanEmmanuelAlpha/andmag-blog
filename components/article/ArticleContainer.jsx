import React, { useEffect, useState } from "react";
import styles from "../../styles/article/ArticleContainer.module.css";
import Header from "./Header";
import { PlayList, PlayListFull } from "./PlayList";
import CommentContainer from "../comment/CommentContainer";
import PageNavigation from "./PageNavigation";
import dynamic from "next/dynamic";
import { articlesCollection } from "../../firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import LoadingScreen from "../inputs/LoadingScreen";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";

const QuillContent = dynamic(() => import("./QuillContent"), {
  ssr: false,
});

export function CircleSeparator() {
  return <div className={styles.cir_spe} />;
}

function PostEndSeparator(props) {
  return (
    <div className={styles._post_end}>
      <CircleSeparator />
      <CircleSeparator />
      <CircleSeparator />
    </div>
  );
}

function ArticleContainer({ article, blog, playlist, comments }) {
  const router = useRouter();

  const [articles, setArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [totalReaders, setTotalReaders] = useState(0);

  const [open, setOpen] = useState(false);

  /** Get all articles remaining to current article playlist */
  useEffect(() => {
    if (!blog || !playlist) return;

    const q = query(
      articlesCollection,
      where("blogId", "==", blog.id),
      where("playlist", "==", playlist.id),
      where("published", "==", true),
      orderBy("createAt")
    );
    getDocs(q)
      .then((snaps) => {
        setArticles([]);
        snaps.forEach((snap) => {
          setArticles((prev) => {
            if (snap.exists())
              return [...prev, { id: snap.id, ...snap.data() }];
            return prev;
          });
        });
      })
      .catch((err) => console.log("Articles error: ", err));

    setLoadingArticles(false);
  }, [blog, playlist]);

  useEffect(() => {
    setTotalReaders((prev) => {
      if (!articles) return 0;

      let value = 0;
      articles.forEach((article, index) => {
        if (!article.readers) value += 0;
        else value += article.readers;
      });
      return value;
    });
  }, [articles]);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.section}>
          <Header article={article} blog={blog} />
          <article>
            <PlayListFull
              playlist={playlist}
              articles={articles}
              totalReaders={totalReaders}
              mobileDevice={true}
            />
            <QuillContent delta={JSON.parse(article.content)} />
          </article>
          <PostEndSeparator />
          <PlayList
            blog={blog}
            playlist={playlist}
            totalReaders={totalReaders}
          />
          <PageNavigation article={article} articles={articles} />
          <div className={styles.com_show}>
            <div>
              <span>Commentaires</span>
              <CircleSeparator />
              <span style={{ marginLeft: "5px" }}>
                {comments > 10 ? comments : `0${comments}`}
              </span>
            </div>
            <button onClick={() => setOpen(!open)}>
              {!open ? (
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
          </div>
          {open && (
            <CommentContainer
              targetRef={articlesCollection}
              targetId={article.id}
              onClose={() => setOpen(!open)}
            />
          )}
        </div>
      </div>
      {loadingArticles ? (
        <LoadingScreen />
      ) : (
        <PlayListFull
          playlist={playlist}
          articles={articles}
          totalReaders={totalReaders}
        />
      )}
    </div>
  );
}

export default ArticleContainer;
