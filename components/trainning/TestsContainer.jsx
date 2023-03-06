import React, { useEffect, useState } from "react";
import styles from "../../styles/trainning/TestsContainer.module.css";
import dynamic from "next/dynamic";
import SkeletonLayout from "../skeleton-layout/SkeletonLayout";
import SubmitButton from "../inputs/SubmitButton";
import LoadingScreen from "../inputs/LoadingScreen";
import useTimer from "../../hooks/useTimer";
import { useTrain } from "../../context/TrainProvider";

const QuillContent = dynamic(() => import("../article/QuillContent"), {
  ssr: false,
});

export function TestResultCard(props) {
  const { currentTrainning, result } = useTrain();

  return (
    <div className={styles.res_card}>
      <h1>{currentTrainning.doc.title}</h1>
      <div className={styles.res_stats}>
        <span>
          <strong>{currentTrainning.doc.questionsNumber}</strong> questions
        </span>
        <span>
          <strong>{currentTrainning.doc.time}</strong> {"min d'évaluation"}
        </span>
        <span>
          <strong>{result.answers}</strong> réponses fournies
        </span>
        <span>
          <strong>{result.skiped}</strong> qestions sautées
        </span>
        <span>
          <strong>{result.correctAnswers}</strong> réponses correctes
        </span>
      </div>
      <div className={styles.res_per}>
        <span>
          {Math.round(
            (result.correctAnswers / currentTrainning.doc.questionsNumber) * 100
          )}
          %
        </span>
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
    currentTrainning.doc?.time * 60,
    finilizeTest
  );

  return (
    <div className={styles.time}>
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

  if (!active) return null;

  return (
    <div className={styles.qcm_wrapper}>
      <div className={styles.nbq}>
        <span>
          Q {qIndex} / {trainning.questionsNumber}
        </span>
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
          onClick={() => onSendAnswer(choosedAnswer)}
        />
        <button onClick={() => onSkip()}>Sauter</button>
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
