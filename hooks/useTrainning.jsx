import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useReducer, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { trainningsCollection } from "../firebase";

const ACTIONS = {
  LOAD_CURRENT: "LOAD_CURRENT",
  LOAD_CURRENT_QUESTION: "LOAD_CURRENT_QUESTION",
  RESET_ANSWERS: "RESET_ANSWERS",
  LOAD_ANSWERS: "LOAD_ANSWERS",
  GET_STATS: "GET_STATS",
  GET_PARTICIPANT: "GET_PARTICIPANT",
  SET_TIME_MANAGER: "SET_TIME_MANAGER",
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

    case ACTIONS.LOAD_CURRENT:
      return {
        ...state,
        currentTrainning: {
          loading: false,
          doc: payload.trainning,
        },
      };

    case ACTIONS.LOAD_CURRENT_QUESTION:
      return {
        ...state,
        question: {
          loading: false,
          doc: payload.question,
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

    case ACTIONS.GET_STATS:
      return {
        ...state,
        stats: {
          loading: false,
          nbQuestions: payload.nb,
          passed: payload.current
            ? [...state.stats.passed, payload.current]
            : state.stats.passed,
        },
      };

    case ACTIONS.GET_PARTICIPANT:
      return {
        ...state,
        participant: payload.participant,
      };

    case ACTIONS.SET_TIME_MANAGER:
      return {
        ...state,
        timeManager: {
          timeElapsed: payload.timeElapsed,
          timeRemaining: payload.timeRemaining,
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
  trainningRef
) {
  const router = useRouter();
  const { currentUserProfile } = useAuth();

  const [currentQuestionRef, setCurrentQuestionRef] = useState();

  const [state, dispatch] = useReducer(reducer, {
    trainnings: {
      loading: true,
      docs: [],
    },
    currentTrainning: {
      loading: true,
      doc: undefined,
    },
    question: {
      loading: true,
      doc: undefined,
    },
    stats: {
      loading: true,
      nbQuestions: undefined,
      passed: [],
    },
    answers: {
      loading: true,
      docs: [],
    },
    participant: undefined,
    timeManager: {
      timeElapsed: undefined,
      timeRemaining: undefined,
    },
  });

  const [loading, setLoading] = useState(true);
  const [docs, setDocs] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  /*function updateScore() {
    if(question.doc.)
  }*/

  function goToNextQuestion() {
    if (!currentQuestionRef) return;

    const next = query(
      collection(trainningsCollection, trainningRef, "questions"),
      orderBy("createAt", "asc"),
      startAfter(currentQuestionRef),
      limit(1)
    );

    getDocs(next).then((snapshot) => {
      snapshot.forEach((doc) => {
        dispatch({
          type: ACTIONS.LOAD_CURRENT_QUESTION,
          payload: { question: { id: doc.id, ...doc.data() } },
        });

        dispatch({
          type: ACTIONS.GET_STATS,
          payload: {
            nb: state.stats.nbQuestions,
            current: doc.id,
          },
        });

        setCurrentQuestionRef(snapshot.docs[snapshot.docs.length - 1]);
      });
    });
  }

  function sendAnswer(answer) {
    const participant = {
      ...state.participant,
      questionsDone: arrayUnion({
        questionId: state.question.doc.id,
        answer: answer,
      }),
      score: null,
      time: state.timeManager.timeElapsed,
    };
    updateParticipant(state.participant.id, participant);

    return goToNextQuestion();
  }

  function skipQuestion() {
    const participant = {
      ...state.participant,
      questionsDone: arrayUnion({
        questionId: state.question.doc.id,
        answer: null,
      }),
      score: null,
      time: state.timeManager.timeElapsed,
    };

    updateParticipant(state.participant.id, participant);

    return goToNextQuestion();
  }

  function newParticipant() {
    let exist = false;

    getDocs(
      collection(trainningsCollection, trainningRef, "participants")
    ).then((snapshot) => {
      snapshot.forEach((doc) => {
        if (doc.data().userId === currentUserProfile.userId) {
          exist = true;
          const participant = {
            id: doc.id,
            score: null,
            time: null,
            createAt: serverTimestamp(),
            updateAt: serverTimestamp(),
            ...doc.data(),
          };
          return updateParticipant(doc.id, participant);
        }
      });
      if (!exist) {
        const participant = {
          userId: currentUserProfile.userId,
          pseudo: currentUserProfile.pseudo,
          pp: currentUserProfile.profilePicture,
          createAt: serverTimestamp(),
          score: null,
          time: null,
        };

        addDoc(
          collection(trainningsCollection, trainningRef, "participants"),
          participant
        ).then((doc) => {
          dispatch({
            type: ACTIONS.GET_PARTICIPANT,
            payload: { participant: { id: doc.id, ...doc.data() } },
          });
        });
      }
    });
  }

  function updateParticipant(docRef, participant) {
    updateDoc(
      doc(trainningsCollection, trainningRef, "participants", docRef),
      participant
    );

    dispatch({
      type: ACTIONS.GET_PARTICIPANT,
      payload: {
        participant: participant,
      },
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
        console.log("error: ", error);
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
      .catch((error) => console.log("Error: ", error));
  }, [trainningRef]);

  /** Get trainning first question and create/update participant */
  useEffect(() => {
    if (!trainningRef || !currentUserProfile) return;

    const first = query(
      collection(trainningsCollection, trainningRef, "questions"),
      orderBy("createAt", "asc"),
      limit(1)
    );

    getDocs(first).then((snapshot) => {
      snapshot.forEach((doc) => {
        setCurrentQuestionRef(doc.ref);
        dispatch({
          type: ACTIONS.LOAD_CURRENT_QUESTION,
          payload: { question: { id: doc.id, ...doc.data() } },
        });
      });

      dispatch({
        type: ACTIONS.GET_STATS,
        payload: { nb: state.stats.nbQuestions, current: doc.id },
      });

      setCurrentQuestionRef(snapshot.docs[snapshot.docs.length - 1]);

      newParticipant();
    });
  }, [trainningRef, currentUserProfile]);

  /** Get all answers off current question */
  useEffect(() => {
    if (!state?.question?.doc?.id || !trainningRef) return;

    const q = query(
      collection(
        trainningsCollection,
        trainningRef,
        "questions",
        state.question.doc.id,
        "answers"
      ),
      orderBy("createAt", "asc")
    );
    getDocs(q).then((snap) => {
      snap.forEach((doc) => {
        dispatch({
          type: ACTIONS.LOAD_ANSWERS,
          payload: { answer: { id: doc.id, ...doc.data() } },
        });
      });
    });
  }, [state?.question?.doc?.id, trainningRef]);

  /** Get trainning questions number */
  useEffect(() => {
    if (!trainningRef) return;

    const q = query(
      collection(trainningsCollection, trainningRef, "questions")
    );

    getDocs(q).then((snapshot) => {
      dispatch({
        type: ACTIONS.GET_STATS,
        payload: { nb: snapshot.docs.length, current: null },
      });
    });
  }, [trainningRef]);

  /** Load timer */
  useEffect(() => {
    if (!state.participant) return;

    dispatch({
      type: ACTIONS.SET_TIME_MANAGER,
      payload: {
        timeElapsed: 0,
        timeRemaining: state.currentTrainning.doc.time * 60,
      },
    });
  }, [state.participant]);

  return {
    trainnings: docs,
    loading: loading,
    hasMore: hasMore,
    currentTrainning: state.currentTrainning,
    question: state.question,
    stats: state.stats,
    timeManager: state.timeManager,
    answers: state.answers,
    participant: state.participant,
    sendAnswer,
    skipQuestion,
  };
}
