import React, { useEffect, useState } from "react";
import styles from "../../../../styles/blog/all.module.css";
import { useRouter } from "next/router";
import BlogContainer from "../../../../components/blog/BlogContainer";
import { PlayList } from "../../../../components/article/PlayList";
import { useTargetBlog } from "../../../../context/BlogProvider";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { articlesCollection, blogsCollection } from "../../../../firebase";
import LoadingScreen from "../../../../components/inputs/LoadingScreen";
import useBlog from "../../../../hooks/useBlog";
import { ArticleCard } from "../../../../components/blog/ArticleCard";

export default function Playlists() {
  const router = useRouter();
  const { blog } = useTargetBlog();
  const { loadingPlaylists, playlists } = useBlog(router.query.blogId, [
    "playlists",
  ]);

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (typeof router.query.list !== "string") return;

    const q = query(
      articlesCollection,
      where("playlist", "==", router.query.list, orderBy("createAt"))
    );
    getDocs(q).then((snaps) => {
      setArticles([]);
      snaps.forEach((snap) => {
        if (!snap.exists()) return;
        setArticles((prev) => [...prev, { id: snap.id, ...snap.data() }]);
      });
    });

    setLoading(false);
  }, [router.query.list]);

  return (
    <BlogContainer title="Playlists">
      {typeof router.query.list !== "string" ? (
        loadingPlaylists ? (
          <LoadingScreen />
        ) : (
          <div className={styles.play_list}>
            {playlists.map((playlist, index) => {
              return (
                <PlayList
                  key={index}
                  blog={blog}
                  playlist={playlist}
                  totalReaders={0}
                />
              );
            })}
          </div>
        )
      ) : loading ? (
        <LoadingScreen />
      ) : articles.length > 0 ? (
        articles.map((article, index) => {
          return (
            <ArticleCard
              key={article.id}
              blogId={article.blogId}
              createBy={article.createBy}
              articleId={article.id}
              blogUrl={`/blogs/${article.blogId}`}
              blogLogo={article.blogLogo}
              blogName={article.blogName}
              thumbnail={article.thumbnail}
              title={article.title}
              reads={article.readers}
              at={article.updateAt ? article.updateAt : article.createAt}
              desc={article.description}
              tags={article.tags}
            />
          );
        })
      ) : null}
    </BlogContainer>
  );
}
