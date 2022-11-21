import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styles from "../../styles/article/ArticleContainer.module.css";
import Header from "./Header";
import { PlayList, PlayListFull } from "./PlayList";
import CommentContainer from "../comment/CommentContainer";
import PageNavigation from "./PageNavigation";
import dynamic from "next/dynamic";
import { articlesCollection, blogsCollection } from "../../firebase";
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

function ArticleContainer({ article }) {
  const router = useRouter();
  const [blog, setBlog] = useState(null);
  const [loadingBlog, setLoadingBlog] = useState(true);

  const [playlist, setPlaylist] = useState(null);
  const [loadingPlaylist, setLoadingPlaylist] = useState(true);

  const [articles, setArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [totalReaders, setTotalReaders] = useState(0);

  const [comments, setComments] = useState(0);
  const [open, setOpen] = useState(false);

  /** Get the associated blog */
  useEffect(() => {
    if (!article) return;
    getDoc(doc(blogsCollection, article.blogId)).then((__blog) => {
      if (!__blog.exists()) {
        return router.push("/articles");
      }
      setBlog({ id: __blog.id, ...__blog.data() });
    });

    setLoadingBlog(false);
  }, [article]);

  /** Get associated playlist */
  useEffect(() => {
    if (!article || !blog) return;

    getDoc(doc(blogsCollection, blog.id, "playlists", article.playlist)).then(
      (__playlist) => {
        if (!__playlist.exists()) {
          return router.push("/articles");
        }
        setPlaylist({ id: __playlist.id, ...__playlist.data() });
      }
    );

    setLoadingPlaylist(false);
  }, [blog, article]);

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

  /** Get number of comments */
  useEffect(() => {
    if (!article) return;

    getDocs(collection(articlesCollection, article.id, "comments")).then(
      (snaps) => {
        setComments((prev) => {
          if (snaps.docs && snaps.docs.length > 0) return snaps.docs.length;
          return prev;
        });
      }
    );
  }, [article]);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.section}>
          {loadingBlog || !blog ? (
            <LoadingScreen />
          ) : (
            <Header article={article} blog={blog} />
          )}
          <article>
            <QuillContent delta={JSON.parse(article.content).ops} />
          </article>
          <PostEndSeparator />
          {loadingPlaylist || loadingBlog || !playlist ? (
            <LoadingScreen />
          ) : (
            <PlayList
              blog={blog}
              playlist={playlist}
              totalReaders={totalReaders}
            />
          )}
          {loadingArticles || articles.length < 1 ? (
            <LoadingScreen />
          ) : (
            <PageNavigation article={article} articles={articles} />
          )}
          <div className={styles.com_show}>
            <span>{comments > 10 ? comments : `0${comments}`} Comments</span>
            <button onClick={() => setOpen(!open)}>
              {!open ? (
                <>
                  <span>Show comments</span>
                  <FontAwesomeIcon icon={faAngleDown} />
                </>
              ) : (
                <>
                  <span>Hide comments</span>
                  <FontAwesomeIcon icon={faAngleUp} />
                </>
              )}
            </button>
          </div>
          <CommentContainer
            isOpen={open}
            targetRef={articlesCollection}
            targetId={article.id}
          />
        </div>
      </div>
      {loadingArticles ||
      loadingPlaylist ||
      articles.length < 1 ||
      !playlist ? (
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
