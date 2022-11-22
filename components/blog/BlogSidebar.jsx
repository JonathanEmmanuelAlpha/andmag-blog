import {
  faBookReader,
  faHome,
  faNewspaper,
  faPeoplePulling,
  faPlayCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useTargetBlog } from "../../context/BlogProvider";
import useBlogFollowers from "../../hooks/useBlogFollowers";
import styles from "../../styles/blog/BlogContainer.module.css";
import LoadingScreen from "../inputs/LoadingScreen";
import { domainName } from "../links/AwesomeLink.type";
import { SubButton } from "./BlogHead";

function AsideHeader({ blog }) {
  const [open, setOpen] = useState(false);
  const followers = useBlogFollowers(blog.id);

  return (
    <header>
      <img src={blog.logo} alt={`${blog.name}.png`} />
      <h1>{blog.name}</h1>
      <h2>{followers ? followers : 0} abonnés</h2>
      <SubButton blog={blog} />
      <div className={styles.stats}>
        <div>
          <FontAwesomeIcon icon={faNewspaper} />
          <span>{blog.articles ? blog.articles.length : 0} articles</span>
        </div>
        <div>
          <FontAwesomeIcon icon={faPeoplePulling} />
          <span>{blog.tests ? blog.tests.length : 0} tests</span>
        </div>
      </div>
    </header>
  );
}

function AsideMenuItem({ url, name, icon }) {
  const router = useRouter();
  return (
    <Link href={`${domainName}${url}`}>
      <a data-active={router.asPath === url}>
        <FontAwesomeIcon icon={icon} />
        <span>{name}</span>
      </a>
    </Link>
  );
}

function AsideMenu({ blogId }) {
  return (
    <nav>
      <AsideMenuItem url={`/blogs/${blogId}`} name="Accueille" icon={faHome} />
      <AsideMenuItem
        url={`/blogs/${blogId}/posts`}
        name="Publications"
        icon={faBookReader}
      />
      <AsideMenuItem
        url={`/blogs/${blogId}/playlists`}
        name="Listes de lecture"
        icon={faPlayCircle}
      />
      <AsideMenuItem
        url={`/blogs/${blogId}/trainnings`}
        name="Tests"
        icon={faPeoplePulling}
      />
    </nav>
  );
}

export default function BlogSidebar() {
  const { blog, loadingBlog } = useTargetBlog();
  return (
    <aside className={styles.sidebar}>
      {loadingBlog ? (
        <LoadingScreen />
      ) : (
        <>
          {" "}
          <AsideHeader blog={blog} />
          <AsideMenu blogId={blog.id} />
        </>
      )}
    </aside>
  );
}
