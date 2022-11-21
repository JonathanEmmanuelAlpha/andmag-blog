import { faEdit, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import AwesomeLink from "../../../components/links/AwesomeLink";
import SkeletonLayout from "../../../components/skeleton-layout/SkeletonLayout";
import { useAuth } from "../../../context/AuthProvider";
import styles from "../../../styles/blog/all.module.css";

export default function Blog() {
  const { userProfile } = useAuth();
  return (
    <SkeletonLayout title="Andmag-ground - Blogs" description="">
      <div className={styles.blog_container}>
        <div className={styles.overlay} />
        <div className={styles.wrapper}>
          <h2 className={`${styles.title} thin-text-3d`}>
            Andmag-ground - Blog
          </h2>
          <div className={styles.links}>
            <AwesomeLink
              direction="horizontal"
              icon={faPlusCircle}
              reverse
              text="Créer un blog"
              url={`/settings/blog/new`}
            />
            <AwesomeLink
              direction="horizontal"
              icon={faEdit}
              reverse
              text="Editer mon blog"
              url={`/settings/blog/new?channel=${userProfile?.blogId}`}
            />
          </div>
        </div>
      </div>
    </SkeletonLayout>
  );
}
