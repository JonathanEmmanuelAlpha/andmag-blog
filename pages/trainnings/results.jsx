import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import LoadingScreen from "../../components/inputs/LoadingScreen";
import { ResultCard } from "../../components/trainning/TestsContainer";
import { useTrain } from "../../context/TrainProvider";
import useParticipants from "../../hooks/useParticipants";
import useOnScreen from "../../hooks/useOnScreen";
import styles from "../../styles/trainning/trainning.module.css";
import SkeletonLayout from "../../components/skeleton-layout/SkeletonLayout";
import Skeleton from "react-loading-skeleton";
import { getTime } from "../../helpers/toTimeString";
import { useAuth } from "../../context/AuthProvider";
import Link from "next/link";
import Image from "next/image";

const COLOR = "#b9b9b9";

function ResultInfo({ test, currentParticipant }) {
  const { userProfile } = useAuth();

  return (
    <div className={styles.res_info}>
      <div className={styles.left}>
        <h1>
          {test ? (
            test.title
          ) : (
            <Skeleton width={150} height={10} baseColor={COLOR} />
          )}
        </h1>
        <p>
          {test ? (
            test.description
          ) : (
            <Skeleton width={300} height={75} baseColor={COLOR} />
          )}
        </p>
        <div className={styles.stats}>
          <span>
            {test ? (
              test.participants + " participants"
            ) : (
              <Skeleton width={80} height={7} baseColor={COLOR} />
            )}
          </span>
          <span>
            {test ? (
              test.questionsNumber + " questions"
            ) : (
              <Skeleton width={80} height={7} baseColor={COLOR} />
            )}
          </span>
          <span>
            {test ? (
              `Score moyen - ${test.average?.score}%`
            ) : (
              <Skeleton width={80} height={7} baseColor={COLOR} />
            )}
          </span>
          <span>
            {test ? (
              `Temps moyen - ${getTime(test.average?.time * 1000)}`
            ) : (
              <Skeleton width={80} height={7} baseColor={COLOR} />
            )}
          </span>
          <span>
            {test ? (
              `Score Max - ${test.maximum?.score}%`
            ) : (
              <Skeleton width={80} height={7} baseColor={COLOR} />
            )}
          </span>
          <span>
            {test ? (
              `Temps Max - ${getTime(test.maximum?.time * 1000)}`
            ) : (
              <Skeleton width={80} height={7} baseColor={COLOR} />
            )}
          </span>
          <span>
            {test ? (
              `Score Min - ${test.minimum?.score}%`
            ) : (
              <Skeleton width={80} height={7} baseColor={COLOR} />
            )}
          </span>
          <span>
            {test ? (
              `Temps Min - ${getTime(test.minimum?.time * 1000)}`
            ) : (
              <Skeleton width={80} height={7} baseColor={COLOR} />
            )}
          </span>
        </div>
      </div>
      <div className={styles.right}>
        {userProfile ? (
          <Image
            src={userProfile.pp}
            className="skeleton"
            width={100}
            height={100}
            priority
          />
        ) : (
          <Skeleton width={100} height={100} baseColor={"#b9b9b9"} circle />
        )}
        {userProfile ? (
          <Link href={`/account/profile?pseudo=${userProfile.pseudo}`}>
            {userProfile.pseudo}
          </Link>
        ) : (
          <Skeleton width={150} height={10} baseColor={"#b9b9b9"} />
        )}
        <div className={styles.stats}>
          <span>
            {currentParticipant ? (
              `Score - ${currentParticipant.score}%`
            ) : (
              <Skeleton width={80} height={7} baseColor={COLOR} />
            )}
          </span>
          <span>
            {currentParticipant ? (
              `Temps Mis - ${getTime(currentParticipant.evaluationTime * 1000)}`
            ) : (
              <Skeleton width={80} height={7} baseColor={COLOR} />
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Trainning() {
  const router = useRouter();
  const [pageNumber, setPageNumber] = useState(1);

  const { currentTrainning } = useTrain();
  const { hasMore, loading, participant, participants } = useParticipants(
    router.query.testChannel,
    pageNumber,
    true
  );

  const divRef = useRef();
  useOnScreen("50px", divRef, () =>
    setPageNumber((prev) => {
      if (hasMore) return prev + 1;
      return prev;
    })
  );

  return (
    <SkeletonLayout
      title={currentTrainning.doc?.title}
      description={currentTrainning.doc?.description}
    >
      <div className={styles.stats}>
        <ResultInfo
          currentParticipant={participant}
          test={currentTrainning.doc}
        />
      </div>
      <div className={styles.res_list}>
        {loading ? (
          <LoadingScreen />
        ) : (
          participants.map((participant, index) => {
            return (
              <ResultCard
                key={participant.id}
                participant={participant}
                test={currentTrainning.doc}
                position={index + 1}
              />
            );
          })
        )}
      </div>
      {!loading && participants.length !== 0 && <div ref={divRef} />}
    </SkeletonLayout>
  );
}
