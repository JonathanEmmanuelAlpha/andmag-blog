import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import Link from "next/link";
import styles from "../../styles/blog/BlogsList.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faBell,
  faNewspaper,
  faPeoplePulling,
} from "@fortawesome/free-solid-svg-icons";
import SearchBar from "../nav-bar/SearchBar";
import { blogsCollection } from "../../firebase";
import useBlogSearch from "../../hooks/useBlogSearch";
import LoadingScreen from "../inputs/LoadingScreen";
import useOnScreen from "../../hooks/useOnScreen";
import AwesomeLink from "../links/AwesomeLink";
import BlogHead from "./BlogHead";
import Skeleton from "react-loading-skeleton";

function BlogItem({ blog }) {
  return (
    <Link href={`/blogs/${blog.id}`}>
      <a className={styles.blog_card}>
        <div className={styles.blog_ban}>
          <Image
            className="skeleton"
            src={blog.banner}
            alt={blog.name + " - banner"}
            layout="fill"
          />
        </div>
        <div className={styles.blog_overlay} />
        <div className={styles.blog_body}>
          <div className={styles.blog_infos}>
            <div className={styles.blog_stats}>
              <div>
                {blog.articles ? (
                  <span>
                    {blog.articles.length < 10
                      ? `0${blog.articles.length}`
                      : blog.articles.length}
                  </span>
                ) : (
                  <span>00</span>
                )}
                <FontAwesomeIcon icon={faNewspaper} />
              </div>
              <div>
                {blog.tests ? (
                  <span>
                    {blog.tests.length < 10
                      ? `0${blog.tests.length}`
                      : blog.tests.length}
                  </span>
                ) : (
                  <span>00</span>
                )}
                <FontAwesomeIcon icon={faPeoplePulling} />
              </div>
            </div>
            <Image
              className="skeleton"
              src={blog.logo}
              alt={blog.name + ".logo"}
              width={60}
              height={60}
            />
          </div>
          <h2>{blog.name}</h2>
          <p>{blog.description}</p>
        </div>
      </a>
    </Link>
  );
}

function BlogsList(props) {
  const [name, setName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  const { docs, error, hasMore, loading } = useBlogSearch(
    searchQuery,
    15,
    pageNumber
  );

  const divRef = useRef();
  useOnScreen("50px", divRef, () =>
    setPageNumber((prev) => {
      if (hasMore) return prev + 1;
      return prev;
    })
  );

  return (
    <div className={styles.container}>
      <SearchBar
        value={name}
        placeholder={"Find blogs by name"}
        handleChange={(e) => setName(e.target.value)}
        handleSearch={() => {
          setSearchQuery(name);
          setPageNumber(1);
        }}
      />
      {loading ? (
        <LoadingScreen />
      ) : (
        <div className={styles.wrapper}>
          {docs.map((blog, index) => (
            <BlogItem key={blog.id} blog={blog} />
          ))}
          <div ref={divRef} />
        </div>
      )}
    </div>
  );
}

BlogsList.propTypes = {};

export default BlogsList;
