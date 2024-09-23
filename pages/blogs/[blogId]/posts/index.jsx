import React, { useRef, useState } from "react";
import styles from "../../../../styles/blog/all.module.css";
import { useRouter } from "next/router";
import BlogContainer from "../../../../components/blog/BlogContainer";
import usePosts from "../../../../hooks/usePosts";
import { PostCard } from "../../../../components/post/PostCard";
import useOnScreen from "../../../../hooks/useOnScreen";
import { useTargetBlog } from "../../../../context/BlogProvider";

export default function Publications() {
  const router = useRouter();
  const { blog } = useTargetBlog();
  const [pageNumber, setPageNumber] = useState(1);

  const {
    docs: posts,
    hasMore,
    loading,
  } = usePosts(router.query.blogId, 10, pageNumber);

  const divRef = useRef();
  useOnScreen("50px", divRef, () => setPageNumber((prev) => prev + 1));

  return (
    <BlogContainer title="Posts">
      <div className={styles.pub_container}>
        {posts.map((post, index) => {
          return (
            <PostCard
              key={index}
              commentShown={false}
              pub={post}
              logo={blog.logo}
              name={blog.name}
              url={`/blogs/${blog.id}/posts`}
            />
          );
        })}
      </div>
      <div ref={divRef} />
    </BlogContainer>
  );
}
