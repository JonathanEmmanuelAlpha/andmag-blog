import React, { useEffect, useState } from "react";
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
  getCountFromServer,
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

  const [blog, setBlog] = useState();
  const [playlist, setPlaylist] = useState();
  const [comments, setComments] = useState();

  const [articles, setArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [totalReaders, setTotalReaders] = useState(0);

  const [open, setOpen] = useState(false);

  /** Get the target article blog */
  useEffect(() => {
    if (!article.id) return;

    getDoc(doc(blogsCollection, article.id)).then((blog) => {
      if (!blog.exists()) return setBlog(undefined);
      const data = { 
        ...blog.data(),
        id: blog.id,
        createAt: blog.data().createAt.seconds,
        updateAt: blog.data().updateAt ? blog.data().updateAt.seconds : null
      };
      setBlog(data);
    });
  }, [article.id]);

  /** Get the target article playlist */
  useEffect(() => {
    if (!article.playlist || !blog?.id) return;

    getDoc(doc(blogsCollection, blog.id, "playlists", article.playlist)).then((playlist) => {
      if (!playlist.exists()) return setPlaylist(undefined);
      const data = {
        ...playlist.data(),
        id: playlist.id,
        createAt: playlist.data().createAt.seconds,
        updateAt: playlist.data().updateAt
          ? playlist.data().updateAt.seconds
          : null,
      };
      setPlaylist(data);
    });
  }, [article.playlist, blog.id]);

  /** Get the target article comments number */
  useEffect(() => {
    if (!article.id) return;

    const coll = collection(articlesCollection, article.id, "comments");
    getCountFromServer(coll).then(snap => {
      if(!snap || snap.data() || snap.data().count) return setComments(0);
      setComments(snap.data().count);
    });
  }, [article]);

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
            return [...prev, { id: snap.id, ...snap.data() }];
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
              loading={loadingArticles}
            />
            <QuillContent delta={JSON.parse(article.content)} />
          </article>
          <PostEndSeparator />
          <PlayList
            blog={blog}
            playlist={playlist}
            totalReaders={totalReaders}
          />
          {articles.length > 1 && (
            <PageNavigation article={article} articles={articles} />
          )}
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
      <PlayListFull
        playlist={playlist}
        articles={articles}
        totalReaders={totalReaders}
        loading={loadingArticles}
      />
    </div>
  );
}

export default ArticleContainer;
