import { useRouter } from "next/router";
import React from "react";
import LoadingScreen from "../../components/inputs/LoadingScreen";
import TestsContainer, {
  QCMCard,
  TestResultCard,
} from "../../components/trainning/TestsContainer";
import { useTrain } from "../../context/TrainProvider";
import useIsAurh from "../../hooks/useIsAurh";
import useTrainning from "../../hooks/useTrainning";

export default function trainning() {
  useIsAurh();
  const {
    currentTrainning,
    questions,
    answers,
    questionId,
    hasFinish,
    setQuestionId,
    sendAnswer,
    skipQuestion,
    finilizeTest,
  } = useTrain();

  return (
    <TestsContainer
      pageTitle={currentTrainning.doc?.title}
      pageDesc={currentTrainning.doc?.description}
    >
      {currentTrainning.loading ? (
        <LoadingScreen />
      ) : questions.loading ? (
        <LoadingScreen />
      ) : (
        questions.docs.map((question, index) => {
          return (
            <QCMCard
              key={index}
              active={question.id === questionId}
              qIndex={index + 1}
              trainning={currentTrainning.doc}
              question={question}
              asnwers={answers}
              onSkip={(time) => {
                skipQuestion(question, time);
                setQuestionId(questions.docs[index + 1]?.id);
              }}
              onSendAnswer={(answer, time) => {
                sendAnswer(answer, question, time);
                setQuestionId(questions.docs[index + 1]?.id);
              }}
            />
          );
        })
      )}
      {currentTrainning.doc && hasFinish && <TestResultCard />}
    </TestsContainer>
  );
}
