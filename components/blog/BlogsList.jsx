import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import Link from "next/link";
import styles from "../../styles/blog/BlogsList.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faBell } from "@fortawesome/free-solid-svg-icons";
import SearchBar from "../nav-bar/SearchBar";
import { blogsCollection } from "../../firebase";
import useBlogSearch from "../../hooks/useBlogSearch";
import LoadingScreen from "../inputs/LoadingScreen";
import useOnScreen from "../../hooks/useOnScreen";
import AwesomeLink from "../links/AwesomeLink";
import BlogHead from "./BlogHead";

function BlogItem({ blog }) {
  return (
    <div className={styles.bi_c}>
      <div
        className={styles.bi_left + " skeleton"}
        style={{ backgroundImage: `url(${blog.banner})` }}
      >
        <Image
          className="skeleton"
          src={blog.logo}
          alt={blog.name + ".logo"}
          width={120}
          height={120}
        />
      </div>
      <div className={styles.bi_right}>
        <BlogHead name={blog.name} />
        <p>{blog.description.slice(0, 254)}</p>
        <div className={styles.stats}>
          <span>{blog.articles ? blog.articles.length : 0} articles</span>
          <span>{blog.tests ? blog.tests.length : 0} tests</span>
        </div>
        <div className={styles.bi_fw_link}>
          <AwesomeLink
            text="Explorer le blog"
            url={`/blogs/${blog.id}`}
            direction="horizontal"
            icon={faArrowRight}
            reverse
          />
        </div>
      </div>
    </div>
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
