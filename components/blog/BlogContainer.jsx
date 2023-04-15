import React from "react";
import PropTypes from "prop-types";
import styles from "../../styles/blog/BlogContainer.module.css";
import Link from "next/link";
import Image from "next/image";
import { domainName } from "../links/AwesomeLink.type";
import BlogHead from "./BlogHead";
import { useRouter } from "next/router";
import useIsOwner from "../../hooks/useIsOwner";
import { useAuth } from "../../context/AuthProvider";
import { blogsCollection } from "../../firebase";
import useBlog from "../../hooks/useBlog";
import LoadingScreen from "../inputs/LoadingScreen";
import Header from "../header/Header";
import SkeletonLayout, { Layout } from "../skeleton-layout/SkeletonLayout";
import { useTargetBlog } from "../../context/BlogProvider";
import BlogSidebar from "./BlogSidebar";

function MenuLink({ url, text }) {
  const router = useRouter();

  return (
    <li data-active={url === router.asPath}>
      <Link href={`${domainName}${url}`}>{text}</Link>
    </li>
  );
}

function Menu() {
  const router = useRouter();
  const blogId = router.query.blogId;

  return (
    <div className={styles.menu}>
      <ul>
        <MenuLink url={`/blogs/${blogId}/posts/publish`} text="Publier" />
        <MenuLink
          url={`/blogs/${blogId}/articles/add`}
          text="Ajouter un article"
        />
        <MenuLink
          url={`/blogs/${blogId}/playlists/add`}
          text="Créer une liste de lecture"
        />
        <MenuLink url={`/blogs/${blogId}/trainnings/add`} text="Nouveau test" />
      </ul>
    </div>
  );
}

function BlogContainer({
  title,
  description,
  author,
  ogImage,
  ogType,
  robots,
  children,
}) {
  const router = useRouter();
  const { blog, loadingBlog, isOwner } = useTargetBlog();

  return (
    <SkeletonLayout
      title={`${blog ? blog.name : "loding..."} - ${title || ""}`}
      description={description}
      author={author}
      ogImage={ogImage}
      ogType={ogType}
      robots={robots}
    >
      <div className={styles.container}>
        <div
          className={styles.banner + " skeleton"}
          style={{ backgroundImage: `url(${blog?.banner})` }}
        />
        <div className={styles.fake} />
        <div className={styles.wrapper}>
          <BlogSidebar />
          <section className={styles.main_section}>
            {isOwner && <Menu />}
            <div className={styles.main_content}>{children}</div>
          </section>
        </div>
      </div>
    </SkeletonLayout>
  );
}

export default BlogContainer;
