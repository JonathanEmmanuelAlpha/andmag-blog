import { useRouter } from "next/router";
import React from "react";
import LoadingScreen from "../../../components/LoadingScreen";
import TestsContainer, { QCMCard } from "../../../components/TestsContainer";
import useTrainning from "../../../hooks/useTrainning";

export default function trainning() {
  const router = useRouter();

  const {
    currentTrainning,
    question,
    stats,
    timeManager,
    answers,
    sendAnswer,
    skipQuestion,
  } = useTrainning();

  return (
    <TestsContainer
      pageTitle={currentTrainning.doc?.title}
      pageDesc={currentTrainning.doc?.description}
    >
      {currentTrainning.loading ? (
        <LoadingScreen />
      ) : (
        <QCMCard
          trainning={currentTrainning.doc}
          question={question}
          stats={stats}
          timeManager={timeManager}
          asnwers={answers}
          onSkip={() => skipQuestion()}
          onSendAnswer={(answer) => sendAnswer(answer)}
        />
      )}
    </TestsContainer>
  );
}
