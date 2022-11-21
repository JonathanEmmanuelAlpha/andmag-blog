import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
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

export default function subscriptions() {
  const { userProfile } = useAuth();

  const [blogs, setBlogs] = useState({ docs: [], loading: true });
  const [articles, setArticles] = useState({ docs: [], loading: true });
  const [tests, setTests] = useState({ docs: [], loading: true });

  /** Fetch user followed blogs */
  useEffect(() => {
    if (!userProfile) return;

    setBlogs({ docs: [], loading: true });
    const blogsFind = userProfile.followed.map((id) => {
      if (typeof id !== "string") return;
      return getDoc(doc(blogsCollection, id)).then((blog) => {
        setBlogs((prev) => {
          if (prev.docs.find((b) => b.id === blog.id)) return prev;
          return {
            loading: false,
            docs: [...prev.docs, { id: blog.id, ...blog.data() }],
          };
        });
      });
    });
    Promise.all(blogsFind);
  }, [userProfile]);

  /** Fetch followed blogs lastest articles */
  useEffect(() => {
    if (!userProfile || blogs.docs.length === 0) return;

    setArticles({ docs: [], loading: true });
    const articlesFind = blogs.docs.map((blog) => {
      if (typeof blog.mostRecentArticle !== "string") return;

      return getDoc(doc(articlesCollection, blog.mostRecentArticle)).then(
        (article) => {
          setArticles((prev) => {
            if (prev.docs.find((a) => a.id === article.id)) return prev;
            return {
              loading: false,
              docs: [...prev.docs, { id: article.id, ...article.data() }],
            };
          });
        }
      );
    });
    Promise.all(articlesFind);
  }, [userProfile, blogs.docs]);

  /** Fetch followed blogs lastest tests */
  useEffect(() => {
    if (!userProfile || blogs.docs.length === 0) return;

    setTests({ docs: [], loading: true });
    const testsFind = blogs.docs.map((blog) => {
      if (typeof blog.mostRecentTest !== "string") return;
      return getDoc(doc(trainningsCollection, blog.mostRecentTest)).then(
        (test) => {
          setTests((prev) => {
            if (prev.docs.find((t) => t.id === test.id)) return prev;
            return {
              loading: false,
              docs: [...prev.docs, { id: test.id, ...test.data() }],
            };
          });
        }
      );
    });
    Promise.all(testsFind);
  }, [userProfile, blogs.docs]);

  return (
    <SkeletonLayout title="Vos abonnements">
      <div className={styles.container}>
        <header>
          {blogs.loading ? (
            <LoadingScreen />
          ) : (
            blogs.docs.map((blog) => <BlogItem key={blog.id} blog={blog} />)
          )}
        </header>
        <fieldset>
          <legend>Les derniers articles</legend>
          {articles.loading ? (
            <LoadingScreen />
          ) : articles.docs.length > 0 ? (
            articles.docs.map((article) => (
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
                reads={article.reads}
                at={article.updateAt}
              />
            ))
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
