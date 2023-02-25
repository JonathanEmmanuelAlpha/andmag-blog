import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import LoadingScreen from "../../components/inputs/LoadingScreen";
import { domainName } from "../../components/links/AwesomeLink.type";
import ActivitiesContainer from "../../components/trainning/ActivitiesContainer";
import TrainningCard from "../../components/trainning/TrainningCard";
import useOnScreen from "../../hooks/useOnScreen";
import useTrainning from "../../hooks/useTrainning";
import styles from "../../styles/trainning/ActivitiesContainer.module.css";

export default function Trainnings(props) {
  const router = useRouter();

  const [pageNumber, setPageNumber] = useState(1);
  const { trainnings, loading, hasMore } = useTrainning(
    router.query.trainChannel,
    20,
    pageNumber,
    null
  );

  const divRef = useRef();
  useOnScreen("50px", divRef, () => setPageNumber((prev) => prev + 1));

  return (
    <ActivitiesContainer pageTitle="Trainnings sessions" pageDesc="" hideBar>
      <div className={styles.card_list}>
        {trainnings.loading ? (
          <LoadingScreen />
        ) : (
          trainnings.map((trainning) => {
            return <TrainningCard key={trainning.id} trainning={trainning} />;
          })
        )}
      </div>
      <div ref={divRef} />
    </ActivitiesContainer>
  );
}
