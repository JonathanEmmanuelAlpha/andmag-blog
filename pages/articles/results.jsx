import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { ArticleCard } from "../../components/blog/ArticleCard";
import Header from "../../components/header/Header";
import LoadingScreen from "../../components/inputs/LoadingScreen";
import SearchBar from "../../components/nav-bar/SearchBar";
import SkeletonLayout, {
  Layout,
} from "../../components/skeleton-layout/SkeletonLayout";
import useArticlesSearch from "../../hooks/useArticlesSearch";
import useOnScreen from "../../hooks/useOnScreen";
import styles from "../../styles/article/base.module.css";

function ArticleResults() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  const {
    docs: articles,
    error,
    hasMore,
    loading,
  } = useArticlesSearch(router.query.search_query, 10, pageNumber);

  const divRef = useRef();
  useOnScreen("50px", divRef, () =>
    setPageNumber((prev) => {
      if (hasMore) return prev + 1;
      return prev;
    })
  );

  return (
    <SkeletonLayout title={"Articles ? " + router.query.search_query}>
      <div className={styles.container}>
        <div className={styles.search}>
          <SearchBar
            value={title}
            placeholder={"Rechercher un article"}
            handleChange={(e) => setTitle(e.target.value)}
            handleDelete={() => setTitle("")}
            handleSearch={async () => {
              const query = title.toLowerCase().split(" ").join("+");
              await router.push(`/articles/results?search_query=${query}`);
            }}
          />
        </div>
        <div className={styles.wrapper}>
          {loading && articles.length === 0 ? (
            <LoadingScreen />
          ) : (
            articles.map((article) => {
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
          )}
        </div>
      </div>
    </SkeletonLayout>
  );
}

export default ArticleResults;
