import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useReducer, useState } from "react";
import { showErrorToast } from "../components/skeleton-layout/ToasComponent";
import { useAuth } from "../context/AuthProvider";
import { useTargetBlog } from "../context/BlogProvider";
import {
  handleFirestoreErrors,
  profilesCollection,
  trainningsCollection,
} from "../firebase";

const ACTIONS = {
  LOAD_CURRENT: "LOAD_CURRENT",
  LOAD_QUESTIONS: "LOAD_QUESTIONS",
  RESET_ANSWERS: "RESET_ANSWERS",
  LOAD_ANSWERS: "LOAD_ANSWERS",
  RESET_QUESTION_DONE: "RESET_QUESTION_DONE",
  ADD_QUESTION_DONE: "ADD_QUESTION_DONE",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.RESET_ANSWERS:
      return {
        ...state,
        answers: {
          loading: true,
          docs: [],
        },
      };

    case ACTIONS.LOAD_CURRENT: // Load current trainning document
      return {
        ...state,
        currentTrainning: {
          loading: false,
          doc: payload.trainning,
        },
        time: {
          initial: payload.trainning.time * 60,
          reamining: 0,
        },
      };

    case ACTIONS.LOAD_QUESTIONS:
      return {
        ...state,
        questions: {
          loading: false,
          docs: [...new Set([...state.questions.docs, payload.question])],
        },
      };

    case ACTIONS.LOAD_ANSWERS:
      return {
        ...state,
        answers: {
          loading: false,
          docs: [...state.answers.docs, payload.answer],
        },
      };

    case ACTIONS.RESET_QUESTION_DONE:
      return {
        ...state,
        questionsDone: [],
      };

    case ACTIONS.ADD_QUESTION_DONE:
      return {
        ...state,
        questionsDone: [...state.questionsDone, payload.item],
        time: {
          ...state.time,
          reamining: payload.timeReamining,
        },
      };

    default:
      return state;
  }
}

export default function useTrainning(
  blogId,
  docLimit = 20,
  pageNumber,
  trainningRef,
  currentQuestionId,
  partNumber = false
) {
  const router = useRouter();
  const { userProfile, loadingProfile } = useAuth();

  const [state, dispatch] = useReducer(reducer, {
    trainnings: {
      loading: true,
      docs: [],
    },
    currentTrainning: {
      loading: true,
      doc: undefined,
    },
    questions: {
      loading: true,
      docs: [],
    },
    answers: {
      loading: true,
      docs: [],
    },
    questionsDone: [],
    time: {
      initial: null,
      reamining: null,
    },
  });

  const [loading, setLoading] = useState(true);
  const [docs, setDocs] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  function getSkiped() {
    let sum = 0;
    state.questionsDone.forEach((done, index) => {
      if (done.answer === null) sum += 1;
    });
    return sum;
  }

  function getAnswers() {
    let sum = 0;
    state.questionsDone.forEach((done, index) => {
      if (typeof done.answer === "string") sum += 1;
    });
    return sum;
  }

  function getCorrectAnswers() {
    let sum = 0;
    state.questionsDone.forEach((done, index) => {
      if (done.answer === done.questionCorrectAnswer) sum += 1;
    });
    return sum;
  }

  /**
   * Get average score and test time
   * @param {Number} partScore
   * @param {Number} partTime
   * @returns
   */
  function getAverage(partScore, partTime) {
    const score = state.currentTrainning.doc.average.averageScore || 0;
    const time = state.currentTrainning.doc.average.averageTime || 0;

    return {
      score: score + partScore / (state.currentTrainning.doc.participants + 1),
      time: time + partTime / (state.currentTrainning.doc.participants + 1),
    };
  }

  function getMax(partScore, partTime) {
    const prevScore = state.currentTrainning.doc.maximum.score || 0;
    const prevTime = state.currentTrainning.doc.maximum.time || 0;

    return {
      score: prevScore > partScore ? prevScore : partScore,
      time: prevScore > partScore ? prevScore : partScore,
    };
  }

  function getMin(partScore, partTime) {
    const prevScore = state.currentTrainning.doc.minimum.score || partScore;
    const prevTime = state.currentTrainning.doc.minimum.time || partTime;

    return {
      score: prevScore < partScore ? prevScore : partScore,
      time: prevScore < partScore ? prevScore : partScore,
    };
  }

  async function finilizeTest() {
    if (!loadingProfile && !userProfile) {
      router.replace(`/account/login?next${router.asPath}`);
      return;
    }
    try {
      const data = {
        score:
          (getCorrectAnswers() / state.currentTrainning.doc.questionsNumber) *
          100,
        evaluationTime: state.time.initial - state.time.reamining,
        updateAt: serverTimestamp(),
      };

      const fetchExistance = await getDoc(
        doc(
          profilesCollection,
          userProfile.id,
          "tests",
          state.currentTrainning.doc.id
        )
      );
      await updateDoc(doc(trainningsCollection, trainningRef), {
        participants: !fetchExistance.exists()
          ? increment(1)
          : state.currentTrainning.doc.participants,
        average: getAverage(data.score, data.evaluationTime),
        maximum: getMax(data.score, data.evaluationTime),
        minimum: getMin(data.score, data.evaluationTime),
      });

      await setDoc(
        doc(
          profilesCollection,
          userProfile.id,
          "tests",
          state.currentTrainning.doc.id
        ),
        data
      );
      await setDoc(
        doc(trainningsCollection, trainningRef, "participants", userProfile.id),
        data
      );

      return router.push(
        `/trainnings/results?testChannel=jcVdFzLJd7iqdfBNvsWt`
      );
    } catch (error) {
      return showErrorToast(handleFirestoreErrors(error));
    }
  }

  function sendAnswer(answer, question, time) {
    const newItem = {
      questionCorrectAnswer: question.correctAnswer,
      answer: answer,
    };

    dispatch({
      type: ACTIONS.ADD_QUESTION_DONE,
      payload: { item: newItem, timeReamining: state.time.reamining + time },
    });
  }

  function skipQuestion(question, time) {
    const newItem = {
      questionCorrectAnswer: question.correctAnswer,
      answer: null,
    };

    dispatch({
      type: ACTIONS.ADD_QUESTION_DONE,
      payload: { item: newItem, timeReamining: state.time.reamining + time },
    });
  }

  /** Pages query system */
  async function goToNextPage() {
    if (!hasMore) {
      console.log("No more tests here !");
      return;
    }

    const q = query(
      trainningsCollection,
      where("blogId", "==", blogId),
      orderBy("createAt"),
      startAfter(lastDoc || 0),
      limit(docLimit)
    );

    getDocs(q)
      .then((snapshot) => {
        snapshot.forEach((snap) => {
          setDocs((prevDocs) => {
            let newDoc = { id: snap.id, ...snap.data() };
            if (prevDocs.find((doc) => doc.id === newDoc.id)) return prevDocs;
            return [...prevDocs, newDoc];
          });
        });
        setHasMore((prev) => snapshot.docs.length > 0);

        // Get the last document
        const last = snapshot.docs[snapshot.docs.length - 1];
        setLastDoc(last);
      })
      .catch((error) => {
        return showErrorToast(handleFirestoreErrors(error));
      });
  }

  /** Get all trainnings */
  useEffect(() => {
    if (!pageNumber || !blogId) return;
    setLoading(true);

    goToNextPage();

    setLoading(false);
  }, [pageNumber, blogId]);

  /** Get current trainnig if asked */
  useEffect(() => {
    if (!trainningRef) return;

    getDoc(doc(trainningsCollection, trainningRef))
      .then((result) => {
        if (!result.exists()) return;
        dispatch({
          type: ACTIONS.LOAD_CURRENT,
          payload: { trainning: { id: result.id, ...result.data() } },
        });
      })
      .catch((error) => {
        return showErrorToast(handleFirestoreErrors(error));
      });
  }, [trainningRef]);

  /** Get trainning questions */
  useEffect(() => {
    if (!trainningRef || loadingProfile || !userProfile) return;

    const q = query(
      collection(trainningsCollection, trainningRef, "questions"),
      orderBy("createAt", "asc")
    );

    getDocs(q)
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          dispatch({
            type: ACTIONS.LOAD_QUESTIONS,
            payload: { question: { id: doc.id, ...doc.data() } },
          });
        });
      })
      .catch((error) => {
        return showErrorToast(handleFirestoreErrors(error));
      });

    dispatch({
      type: ACTIONS.RESET_QUESTION_DONE,
    });
  }, [trainningRef, loadingProfile, userProfile]);

  /** Get all answers off current question */
  useEffect(() => {
    if (!currentQuestionId || !trainningRef) return;

    dispatch({
      type: ACTIONS.RESET_ANSWERS,
    });

    const q = query(
      collection(
        trainningsCollection,
        trainningRef,
        "questions",
        currentQuestionId,
        "answers"
      ),
      orderBy("createAt", "asc")
    );
    getDocs(q)
      .then((snap) => {
        snap.forEach((doc) => {
          dispatch({
            type: ACTIONS.LOAD_ANSWERS,
            payload: { answer: { id: doc.id, ...doc.data() } },
          });
        });
      })
      .catch((error) => {
        return showErrorToast(handleFirestoreErrors(error));
      });
  }, [currentQuestionId, trainningRef]);

  /** Look for test last question */
  useEffect(() => {
    if (
      state.currentTrainning.doc === undefined ||
      state.currentTrainning.doc.questionsNumber !== state.questionsDone.length
    )
      return;

    finilizeTest();
  }, [state.questionsDone, state.currentTrainning.doc]);

  return {
    trainnings: docs,
    loading: loading,
    hasMore: hasMore,
    currentTrainning: state.currentTrainning,
    questions: state.questions,
    answers: state.answers,
    result: {
      answers: getAnswers(),
      skiped: getSkiped(),
      correctAnswers: getCorrectAnswers(),
    },
    hasFinish:
      state.currentTrainning.doc !== undefined &&
      state.currentTrainning.doc.questionsNumber === state.questionsDone.length,
    sendAnswer,
    skipQuestion,
    finilizeTest,
  };
}
