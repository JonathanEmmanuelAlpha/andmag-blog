import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { ArticleCard } from "../../components/blog/ArticleCard";
import Infos from "../../components/inputs/Infos";
import LoadingScreen from "../../components/inputs/LoadingScreen";
import SkeletonLayout from "../../components/skeleton-layout/SkeletonLayout";
import { useAuth } from "../../context/AuthProvider";
import { articlesCollection } from "../../firebase";
import styles from "../../styles/settings/base.module.css";

export default function Subscriptions() {
  const { userProfile } = useAuth();

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  /** Fetch user favarites articles */
  useEffect(() => {
    if (
      !userProfile ||
      !userProfile.favorites ||
      userProfile.favorites.length === 0
    ) {
      return setLoading(false);
    }

    setLoading(true);
    setArticles([]);
    const articlesFind = userProfile.favorites.map((id) => {
      if (typeof id !== "string") return;

      return getDoc(doc(articlesCollection, id)).then((article) => {
        setArticles((prev) => {
          if (prev.find((a) => a.id === article.id)) return prev;
          return [...prev, { id: article.id, ...article.data() }];
        });
      });
    });
    Promise.all(articlesFind);

    setLoading(false);
  }, [userProfile]);

  return (
    <SkeletonLayout title="Mes articles favoris">
      <div className={styles.container}>
        <h2>Mes articles favoris</h2>
        <div className={styles.list}>
          {loading ? (
            <LoadingScreen />
          ) : articles.length > 0 ? (
            articles.map((article) => (
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
            ))
          ) : (
            <Infos
              title={"Aucun article favoris"}
              message="Vous n'avez ajouter aucun article à votre liste d'article favoris. Vous pouvez remédier à cette situation en cliquant sur favoris lors de la lecture d'un article."
              link1={{
                text: "Tous les articles",
                url: "/articles",
              }}
              link2={{
                text: "Mes abonnements",
                url: "/subscriptions",
              }}
            />
          )}
        </div>
      </div>
    </SkeletonLayout>
  );
}
