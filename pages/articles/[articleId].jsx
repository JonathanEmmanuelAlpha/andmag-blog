import { collection, doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ArticleContainer from "../../components/article/ArticleContainer";
import Header from "../../components/header/Header";
import LoadingScreen from "../../components/inputs/LoadingScreen";
import SkeletonLayout, {
  Layout,
} from "../../components/skeleton-layout/SkeletonLayout";
import { articlesCollection, blogsCollection } from "../../firebase";

export default function ArticleId(props) {
  const router = useRouter();

  const [article, setArticle] = useState(null);

  const [loading, setloading] = useState(true);

  useEffect(() => {
    if (typeof router.query.articleId !== "string") return;

    /** Get target article */
    getDoc(doc(articlesCollection, router.query.articleId)).then((snap) => {
      if (!snap.exists() || !snap.data().published) return setArticle(null);
      setArticle({ id: snap.id, ...snap.data() });
    });

    setloading(false);
  }, [router.query.articleId]);

  return (
    <SkeletonLayout
      title={loading ? "loading.." : article ? article.title : "Andmag-ground"}
      description={loading ? "loading.." : article ? article.description : ""}
      ogImage={loading ? "" : article ? article.thumbnail : ""}
      ogType="article"
    >
      {loading || !article ? (
        <LoadingScreen />
      ) : (
        <ArticleContainer article={article} />
      )}
    </SkeletonLayout>
  );
}
