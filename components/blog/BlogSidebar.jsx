import {
  faBookReader,
  faHome,
  faNewspaper,
  faPeoplePulling,
  faPlayCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useTargetBlog } from "../../context/BlogProvider";
import useBlogFollowers from "../../hooks/useBlogFollowers";
import styles from "../../styles/blog/BlogContainer.module.css";
import LoadingScreen from "../inputs/LoadingScreen";
import { SubButton } from "./BlogHead";
import Skeleton from "react-loading-skeleton";

function AsideHeader({ blog }) {
  const [open, setOpen] = useState(false);
  const { followers: _f } = useTargetBlog();
  const [followers, setFollowers] = useState(0);

  useEffect(() => {
    if (!_f) return;

    setFollowers(_f);
  }, [_f]);

  return (
    <header>
      {blog && blog.logo ? (
        <Image
          src={blog.logo}
          alt={`${blog.name}.png`}
          width={100}
          height={100}
          className="skeleton"
        />
      ) : (
        <Skeleton width={100} height={100} baseColor={"#a3b8c2"} circle />
      )}
      <h1>
        {blog ? (
          blog.name
        ) : (
          <Skeleton
            width={200}
            height={10}
            baseColor={"#a3b8c2"}
            borderRadius={10}
          />
        )}
      </h1>
      <h2>
        {followers ? (
          `${followers} abonnés`
        ) : (
          <Skeleton
            width={150}
            height={8}
            baseColor={"#a3b8c2"}
            borderRadius={10}
          />
        )}
      </h2>
      {blog ? (
        <SubButton
          blog={blog}
          onSubscribe={() => setFollowers((prev) => prev + 1)}
          onUnSubscribe={() => setFollowers((prev) => prev - 1)}
        />
      ) : (
        <Skeleton
          width={120}
          height={35}
          baseColor={"#a3b8c2"}
          borderRadius={30}
        />
      )}
      <div className={styles.stats}>
        <div>
          <FontAwesomeIcon icon={faNewspaper} />
          <span>
            {blog ? (
              `${blog.articles ? blog.articles.length : 0} articles`
            ) : (
              <Skeleton
                width={50}
                height={6}
                baseColor={"#a3b8c2"}
                borderRadius={10}
              />
            )}
          </span>
        </div>
        <div>
          <FontAwesomeIcon icon={faPeoplePulling} />
          <span>
            {blog ? (
              `${blog.tests ? blog.tests.length : 0} tests`
            ) : (
              <Skeleton
                width={50}
                height={6}
                baseColor={"#a3b8c2"}
                borderRadius={10}
              />
            )}
          </span>
        </div>
      </div>
    </header>
  );
}

function AsideMenuItem({ url, name, icon }) {
  const router = useRouter();
  return (
    <Link href={url}>
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
      {blogId ? (
        <AsideMenuItem
          url={`/blogs/${blogId}`}
          name="Accueille"
          icon={faHome}
        />
      ) : (
        <Skeleton
          width={140}
          height={100}
          baseColor={"#a3b8c2"}
          borderRadius={5}
        />
      )}
      {blogId ? (
        <AsideMenuItem
          url={`/blogs/${blogId}/posts`}
          name="Publications"
          icon={faBookReader}
        />
      ) : (
        <Skeleton
          width={140}
          height={100}
          baseColor={"#a3b8c2"}
          borderRadius={5}
        />
      )}
      {blogId ? (
        <AsideMenuItem
          url={`/blogs/${blogId}/playlists`}
          name="Listes de lecture"
          icon={faPlayCircle}
        />
      ) : (
        <Skeleton
          width={140}
          height={100}
          baseColor={"#a3b8c2"}
          borderRadius={5}
        />
      )}
      {blogId ? (
        <AsideMenuItem
          url={`/blogs/${blogId}/trainnings`}
          name="Tests"
          icon={faPeoplePulling}
        />
      ) : (
        <Skeleton
          width={140}
          height={100}
          baseColor={"#a3b8c2"}
          borderRadius={5}
        />
      )}
    </nav>
  );
}

export default function BlogSidebar() {
  const { blog, loadingBlog } = useTargetBlog();
  return (
    <aside className={styles.sidebar}>
      <AsideHeader blog={blog} />
      <AsideMenu blogId={blog?.id} />
    </aside>
  );
}
