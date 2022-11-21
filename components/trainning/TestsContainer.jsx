import React, { useState } from "react";
import PropTypes from "prop-types";
import styles from "../styles/components-styles/TestsContainer.module.css";
import AppSkeleton from "./AppSkeleton";
import SubmitButton from "./SubmitButton";
import dynamic from "next/dynamic";
import LoadingScreen from "./LoadingScreen";
import useTimer from "../hooks/useTimer";

const QuillContent = dynamic(() => import("./post/QuillContent"), {
  ssr: false,
});

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
      <label htmlFor={answerId} id={answerId} data-active={active}>
        <span>{letter}.</span>
        <QuillContent delta={answer} />
      </label>
    </div>
  );
}

export function QCMCard({
  question,
  stats,
  trainning,
  asnwers,
  timeManager,
  onSkip,
  onSendAnswer,
}) {
  const timer = useTimer(timeManager.timeRemaining);
  const [choosedAnswer, setChoosedAnswer] = useState("");

  return (
    <div className={styles.qcm_wrapper}>
      <div className={styles.nbq}>
        {stats.loading ? (
          <LoadingScreen />
        ) : (
          <span>
            Q{" "}
            {stats.passed.length > 10
              ? stats.passed.length
              : `0${stats.passed.length}`}{" "}
            / {stats.nbQuestions}
          </span>
        )}
      </div>
      <div className={styles.level}>
        <span>{trainning.level}</span>
      </div>
      <div className={styles.time}>
        <span>{timer}</span>
      </div>
      {question.doc?.content ? (
        <QuillContent delta={JSON.parse(question.doc.content)} />
      ) : (
        <LoadingScreen />
      )}
      {asnwers.loading ? (
        <LoadingScreen />
      ) : (
        asnwers.docs.map((answer, index) => {
          return (
            <QCMItem
              key={answer.id}
              questionId={question.doc.id}
              answerId={answer.id}
              letter={String.fromCharCode(index + 65)}
              answer={JSON.parse(answer.content)}
              handleChange={(event) => setChoosedAnswer(event.target.value)}
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
        <button onClick={onSkip}>Sauter</button>
      </div>
    </div>
  );
}

function TestsContainer({ pageTitle, pageDesc, children }) {
  return (
    <AppSkeleton headerTitle={pageTitle} headerDesc={pageDesc}>
      <div className={styles.container}>{children}</div>
    </AppSkeleton>
  );
}

TestsContainer.propTypes = {
  pageTitle: PropTypes.string,
  pageDesc: PropTypes.string,
};

export default TestsContainer;
