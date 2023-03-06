import React, { useRef, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../../../styles/blog/all.module.css";
import { useRouter } from "next/router";
import Header from "../../../components/header/Header";
import { Layout } from "../../../components/skeleton-layout/SkeletonLayout";
import useOnScreen from "../../../hooks/useOnScreen";
import LoadingScreen from "../../../components/inputs/LoadingScreen";
import BlogContainer from "../../../components/blog/BlogContainer";
import useArticles from "../../../hooks/useArticles";
import { ArticleCard } from "../../../components/blog/ArticleCard";

export default function Blog() {
  const router = useRouter();

  const [pageNumber, setPageNumber] = useState(1);

  const {
    docs: articles,
    hasMore,
    loading,
  } = useArticles(router.query.blogId, 9, pageNumber);

  const divRef = useRef();
  useOnScreen("50px", divRef, () => setPageNumber((prev) => prev + 1));

  return (
    <BlogContainer>
      {loading ? (
        <LoadingScreen />
      ) : (
        <>
          <div className={styles.list}>
            {articles.map((article, index) => {
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
                  at={article.updateAt}
                />
              );
            })}
          </div>
          <div ref={divRef} />
        </>
      )}
    </BlogContainer>
  );
}
