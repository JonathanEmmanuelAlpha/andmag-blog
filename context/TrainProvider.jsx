import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import useTimer from "../hooks/useTimer";
import useTrainning from "../hooks/useTrainning";

const TrainContext = React.createContext();

export function useTrain() {
  return useContext(TrainContext);
}

export default function TrainProvider({ children }) {
  const router = useRouter();

  const [questionId, setQuestionId] = useState();

  const {
    currentTrainning,
    questions,
    answers,
    testTimeOutput,
    result,
    hasFinish,
    sendAnswer,
    skipQuestion,
    finilizeTest,
  } = useTrainning(null, null, null, router.query.testChannel, questionId);

  useEffect(() => {
    if (questions.loading || questions.docs.length < 1) return;
    setQuestionId(questions.docs[0].id);
  }, [questions]);

  const value = {
    currentTrainning,
    questions,
    answers,
    questionId,
    result,
    hasFinish,
    setQuestionId,
    sendAnswer,
    skipQuestion,
    finilizeTest,
  };

  return (
    <TrainContext.Provider value={value}>{children}</TrainContext.Provider>
  );
}
