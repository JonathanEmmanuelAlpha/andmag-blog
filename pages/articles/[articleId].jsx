import React, { useEffect, useState } from "react";
import ArticleContainer from "../../components/article/ArticleContainer";
import SkeletonLayout from "../../components/skeleton-layout/SkeletonLayout";
import { articlesCollection, blogsCollection, db } from "../../libs/database";

function ArticleId({ article, blog, playlist, comments }) {
  return (
    <SkeletonLayout
      title={article.title}
      description={article.description}
      ogImage={article.thumbnail}
      ogType="article"
      author={blog.name}
    >
      <ArticleContainer
        article={article}
        blog={blog}
        playlist={playlist}
        comments={comments}
      />
    </SkeletonLayout>
  );
}

export async function getServerSideProps(context) {
  if (!context.params || typeof context.params.articleId !== "string") {
    return {
      redirect: {
        destination: "/articles",
        permanent: false,
      },
    };
  }

  const root = context.params.articleId.split("-");
  const articleId = root[root.length - 1];

  const article = await articlesCollection.doc(articleId).get();
  if (!article.exists) {
    return {
      redirect: {
        destination: "/articles",
        permanent: false,
      },
    };
  }

  const blog = await blogsCollection.doc(article.data().blogId).get();
  if (!blog.exists) {
    return {
      redirect: {
        destination: "/articles",
        permanent: false,
      },
    };
  }

  const playlist = await blogsCollection
    .doc(blog.id)
    .collection("playlists")
    .doc(article.data().playlist)
    .get();
  if (!playlist.exists) {
    return {
      redirect: {
        destination: "/articles",
        permanent: false,
      },
    };
  }

  const snaps = await db
    .collection(`articles/${article.id}/comments`)
    .count()
    .get();
  const comments = snaps.data().count;

  return {
    props: {
      article: {
        ...article.data(),
        id: article.id,
        createAt: article.data().createAt.seconds,
        updateAt: article.data().updateAt
          ? article.data().updateAt.seconds
          : null,
      },
      blog: {
        ...blog.data(),
        id: blog.id,
        createAt: blog.data().createAt.seconds,
        updateAt: blog.data().updateAt ? blog.data().updateAt.seconds : null,
      },
      playlist: {
        ...playlist.data(),
        id: playlist.id,
        createAt: playlist.data().createAt.seconds,
        updateAt: playlist.data().updateAt
          ? playlist.data().updateAt.seconds
          : null,
      },
      comments: comments,
    },
  };
}

export default ArticleId;
