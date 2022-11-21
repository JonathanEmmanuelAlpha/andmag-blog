import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import BlogContainer from "../../../../components/blog/BlogContainer";
import useTrainning from "../../../../hooks/useTrainning";
import LoadingScreen from "../../../../components/inputs/LoadingScreen";
import { domainName } from "../../../../components/links/AwesomeLink.type";
import TrainningCard from "../../../../components/trainning/TrainningCard";
import useOnScreen from "../../../../hooks/useOnScreen";
import styles from "../../../../styles/trainning/ActivitiesContainer.module.css";

export default function Trainnings(props) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  const { trainnings, hasMore, loading } = useTrainning(
    router.query.blogId,
    20,
    pageNumber
  );

  useEffect(() => {
    if (loading) return;

    console.log("Tests: ", trainnings);
  }, [loading]);

  const divRef = useRef();
  useOnScreen("0px", divRef, () => {
    setPageNumber((prev) => prev + 1);
  });

  return (
    <BlogContainer title={"Tests"} description={""}>
      {loading ? (
        <LoadingScreen />
      ) : (
        <div className={styles.card_list}>
          {trainnings.map((trainning) => {
            return <TrainningCard key={trainning.id} trainning={trainning} />;
          })}
        </div>
      )}
      <div className="ref-div" ref={divRef} />
    </BlogContainer>
  );
}
