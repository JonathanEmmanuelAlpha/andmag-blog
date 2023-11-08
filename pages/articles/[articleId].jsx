import ArticleContainer from "../../components/article/ArticleContainer";
import SkeletonLayout from "../../components/skeleton-layout/SkeletonLayout";
import { articlesCollection } from "../../libs/database";

function ArticleId({ article }) {
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
    },
  };
}

export default ArticleId;
