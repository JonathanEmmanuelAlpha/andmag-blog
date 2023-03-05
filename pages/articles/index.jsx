import React, { useRef, useState } from "react";
import { ArticleCard } from "../../components/blog/ArticleCard";
import Header from "../../components/header/Header";
import LoadingScreen from "../../components/inputs/LoadingScreen";
import SearchBar from "../../components/nav-bar/SearchBar";
import SkeletonLayout, {
  Layout,
} from "../../components/skeleton-layout/SkeletonLayout";
import generateRSSFeed from "../../helpers/generateRSSFeed";
import useArticlesSearch from "../../hooks/useArticlesSearch";
import useOnScreen from "../../hooks/useOnScreen";
import styles from "../../styles/article/base.module.css";

function Articles() {
  const [title, setTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  const {
    docs: articles,
    error,
    hasMore,
    loading,
  } = useArticlesSearch(searchQuery, 9, pageNumber);

  const divRef = useRef();
  useOnScreen("50px", divRef, () =>
    setPageNumber((prev) => {
      if (hasMore) return prev + 1;
      return prev;
    })
  );

  return (
    <SkeletonLayout title={"Andmag-ground - Articles"}>
      <div className={styles.container}>
        <div className={styles.search}>
          <SearchBar
            value={title}
            placeholder={"Find an article"}
            handleChange={(e) => setTitle(e.target.value)}
            handleSearch={() => {
              setSearchQuery(title);
              setPageNumber(1);
            }}
          />
        </div>
        <div className={styles.wrapper}>
          {loading ? (
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
                  blogLogo={article.blog?.logo}
                  blogName={article.blog?.name}
                  thumbnail={article.thumbnail}
                  title={article.title}
                  reads={article.readers}
                  at={article.updateAt}
                />
              );
            })
          )}
        </div>
      </div>
    </SkeletonLayout>
  );
}

export async function getStaticProps() {
  try {
    await generateRSSFeed();
  } catch (error) {
    console.log("Feed Error: ", error);
  }

  return {
    props: {},
  };
}

export default Articles;
