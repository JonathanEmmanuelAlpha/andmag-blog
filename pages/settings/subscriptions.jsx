import { faAnglesDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  doc,
  documentId,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { ArticleCard } from "../../components/blog/ArticleCard";
import LoadingScreen from "../../components/inputs/LoadingScreen";
import SkeletonLayout from "../../components/skeleton-layout/SkeletonLayout";
import TrainningCard from "../../components/trainning/TrainningCard";
import { useAuth } from "../../context/AuthProvider";
import {
  articlesCollection,
  blogsCollection,
  trainningsCollection,
} from "../../firebase";
import styles from "../../styles/settings/main..module.css";

function BlogItem({ blog }) {
  return (
    <Link href={`/blogs/${blog.id}`}>
      <a className={styles.blog_item}>
        <Image className="skeleton" src={blog.logo} width={40} height={40} />
        <span>{blog.name}</span>
      </a>
    </Link>
  );
}

export default function Subscriptions() {
  const { userProfile } = useAuth();

  const [blogs, setBlogs] = useState({ docs: [], loading: true });
  const [articles, setArticles] = useState({ docs: [], loading: true });
  const [tests, setTests] = useState({ docs: [], loading: true });

  const [isActive, setIsActive] = useState(false);

  /** Fetch user followed blogs */
  useEffect(() => {
    if (!userProfile) return;

    const blogQuery = query(
      blogsCollection,
      where(documentId(), "in", userProfile.followed)
    );
    getDocs(blogQuery).then((snaps) => {
      snaps.forEach((blog) => {
        setBlogs((prev) => {
          if (prev.docs.find((b) => b.id === blog.id)) return prev;
          return {
            loading: false,
            docs: [...prev.docs, { id: blog.id, ...blog.data() }],
          };
        });
      });
    });
  }, [userProfile]);

  /** Fetch followed blogs lastest articles */
  useEffect(() => {
    if (!userProfile || blogs.docs.length === 0) return;

    const recentArticle = blogs.docs
      .map((b) => b.mostRecentArticle)
      .filter((res) => res !== undefined);

    setArticles({ docs: [], loading: true });

    const articleQuery = query(
      articlesCollection,
      where(documentId(), "in", recentArticle)
    );
    getDocs(articleQuery).then((snaps) => {
      snaps.forEach((article) => {
        setArticles((prev) => {
          if (prev.docs.find((a) => a.id === article.id)) return prev;
          return {
            loading: false,
            docs: [...prev.docs, { id: article.id, ...article.data() }],
          };
        });
      });
    });
  }, [userProfile, blogs.docs]);

  /** Fetch followed blogs lastest tests */
  useEffect(() => {
    if (!userProfile || blogs.docs.length === 0) return;

    setTests({ docs: [], loading: true });

    const recentTest = blogs.docs
      .map((b) => b.mostRecentTest)
      .filter((res) => res !== undefined);

    setArticles({ docs: [], loading: true });

    const testQuery = query(
      trainningsCollection,
      where(documentId(), "in", recentTest)
    );
    getDocs(testQuery).then((snaps) => {
      snaps.forEach((test) => {
        setTests((prev) => {
          if (prev.docs.find((t) => t.id === test.id)) return prev;
          return {
            loading: false,
            docs: [...prev.docs, { id: test.id, ...test.data() }],
          };
        });
      });
    });
  }, [userProfile, blogs.docs]);

  return (
    <SkeletonLayout title="Mes abonnements">
      <div className={styles.container}>
        <fieldset>
          <legend>Les derniers articles</legend>
          {articles.loading ? (
            <LoadingScreen />
          ) : articles.docs.length > 0 ? (
            <div className={styles.list}>
              {articles.docs.map((article) => (
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
              ))}
            </div>
          ) : (
            <Infos
              title={"Aucun article trouvé"}
              message="Ceci peut être du au fait que vous n'êtes abonnés à aucun blog. Vérifier également que le(s) blog(s) suivi(s) possede(nt) des articles."
              link1={{
                text: "Tous les articles",
                url: "/articles",
              }}
              link2={{
                text: "Tous les blogs",
                url: "/blogs",
              }}
            />
          )}
        </fieldset>
        <fieldset>
          <legend>Les derniers tests</legend>
          {tests.loading ? (
            <LoadingScreen />
          ) : tests.docs.length > 0 ? (
            tests.docs.map((test) => (
              <TrainningCard key={test.id} trainning={test} />
            ))
          ) : (
            <Infos
              title={"Aucun test trouvé"}
              message="Ceci peut être du au fait que vous n'êtes abonnés à aucun blog. Vérifier également que le(s) blog(s) suivi(s) possede(nt) des tests auxquels vous pouvez participer."
              link1={{
                text: "Tous les tests",
                url: "/trainnings",
              }}
              link2={{
                text: "Tous les blogs",
                url: "/blogs",
              }}
            />
          )}
        </fieldset>
      </div>
    </SkeletonLayout>
  );
}
