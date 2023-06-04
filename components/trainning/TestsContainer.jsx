import React, { useEffect, useState } from "react";
import styles from "../../styles/trainning/TestsContainer.module.css";
import dynamic from "next/dynamic";
import Image from "next/image";
import SkeletonLayout from "../skeleton-layout/SkeletonLayout";
import SubmitButton from "../inputs/SubmitButton";
import LoadingScreen from "../inputs/LoadingScreen";
import useTimer from "../../hooks/useTimer";
import { useTrain } from "../../context/TrainProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGraduationCap,
  faUserClock,
  faUserGraduate,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/AuthProvider";
import Skeleton from "react-loading-skeleton";
import Link from "next/link";
import { getTime } from "../../helpers/toTimeString";

const QuillContent = dynamic(() => import("../article/QuillContent"), {
  ssr: false,
});

export function ResultCard({ test, participant, position }) {
  const { currentUser, userProfile } = useAuth();

  /**
   * @param {Number} score
   */
  function getScorePlage(score) {
    if (score >= 80) return "higher";
    if (score >= 70 < 80) return "advanced";
    if (score >= 50 < 70) return "medium";
    if (score >= 30 < 50) return "failled";
    if (score < 30) return "null";
  }

  return (
    <div
      className={styles.res_card}
      data-score-plage={getScorePlage(participant.score)}
    >
      {participant.profile ? (
        <Image
          src={participant.profile.pp}
          className="skeleton"
          width={100}
          height={100}
          priority
        />
      ) : (
        <Skeleton width={100} height={100} baseColor={"#b9b9b9"} circle />
      )}
      {participant.profile ? (
        <Link href={`/account/profile?pseudo=${participant.profile.pseudo}`}>
          {participant.profile.pseudo}
        </Link>
      ) : (
        <Skeleton width={150} height={10} baseColor={"#b9b9b9"} />
      )}
      <div className={styles.res_wrap}>
        <div className={styles.res_item}>
          <FontAwesomeIcon icon={faGraduationCap} />
          <span>
            {position} / {test.participants}
          </span>
        </div>
        <div className={styles.res_item}>
          <FontAwesomeIcon icon={faUserGraduate} />
          <span>{participant.score}%</span>
        </div>
        <div className={styles.res_item}>
          <FontAwesomeIcon icon={faUserClock} />
          <span>{getTime(participant.evaluationTime * 1000)}</span>
        </div>
      </div>
    </div>
  );
}

function QCMItem({
  active,
  questionId,
  letter,
  answer,
  answerId,
  handleChange,
}) {
  return (
    <div className={styles.qcm_item}>
      <input
        type="radio"
        checked={active}
        name={questionId}
        value={answerId}
        id={letter}
        onChange={handleChange}
        onClick={(event) => {
          const parent = event.target.parentElement;
          const currentlabel = parent.querySelector("label");

          const labels = parent.parentElement.querySelectorAll("label");
          labels.forEach(
            (label) => label !== currentlabel && delete label.dataset.active
          );
          currentlabel.dataset.active = true;
        }}
      />
      <label htmlFor={letter} id={answerId} data-active={active}>
        <span>{letter}.</span>
        <QuillContent delta={answer} />
      </label>
    </div>
  );
}

function Timer(props) {
  const { currentTrainning, finilizeTest } = useTrain();

  const { output, timer, updateOutput } = useTimer(
    Math.floor(
      (currentTrainning.doc?.time * 60) / currentTrainning.doc.questionsNumber
    ),
    () => finilizeTest()
  );

  return (
    <div className={styles.time} data-time-value={timer}>
      <span>{output}</span>
    </div>
  );
}

export function QCMCard({
  active,
  qIndex,
  question,
  trainning,
  asnwers,
  onSkip,
  onSendAnswer,
}) {
  const [choosedAnswer, setChoosedAnswer] = useState("");

  function getTimer() {
    const target = document.querySelector("[data-time-value]");
    return parseInt(target.dataset.timeValue);
  }

  if (!active) return null;

  return (
    <div className={styles.qcm_wrapper}>
      <div className={styles.nbq}>
        <span>
          Q {qIndex} / {trainning.questionsNumber}
        </span>
      </div>
      <div className={styles.level}>
        <span>{trainning.level}</span>
      </div>
      <Timer />
      {question.content ? (
        <QuillContent delta={JSON.parse(question.content)} />
      ) : (
        <LoadingScreen />
      )}
      {asnwers.loading ? (
        <LoadingScreen />
      ) : (
        asnwers.docs.map((answer, index) => {
          return (
            <QCMItem
              active={choosedAnswer === answer.id}
              key={answer.id}
              questionId={question.id}
              answerId={answer.id}
              letter={String.fromCharCode(index + 65)}
              answer={JSON.parse(answer.content)}
              handleChange={(event) => {
                setChoosedAnswer(event.target.value);
              }}
            />
          );
        })
      )}
      <div className={styles.btns}>
        <SubmitButton
          cannotSubmit
          loading={false}
          progress={25}
          text="Soumettre"
          onClick={() => onSendAnswer(choosedAnswer, getTimer())}
        />
        <button onClick={() => onSkip(getTimer())}>Sauter</button>
      </div>
    </div>
  );
}

function TestsContainer({ pageTitle, pageDesc, children }) {
  return (
    <SkeletonLayout title={pageTitle} description={pageDesc}>
      <div className={styles.container}>{children}</div>
    </SkeletonLayout>
  );
}

export default TestsContainer;
