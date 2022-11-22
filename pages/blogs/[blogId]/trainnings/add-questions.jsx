import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import styles from "../../../../styles/trainning/trainning.module.css";
import { useRouter } from "next/router";
import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useAuth } from "../../../../context/AuthProvider";
import dynamic from "next/dynamic";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import {
  handleFirestoreErrors,
  trainningsCollection,
} from "../../../../firebase";
import BlogContainer from "../../../../components/blog/BlogContainer";
import LoadingScreen from "../../../../components/inputs/LoadingScreen";
import { useTargetBlog } from "../../../../context/BlogProvider";
import useIsAdmin from "../../../../hooks/useIsAdmin";
import SubmitButton from "../../../../components/inputs/SubmitButton";
import Alert from "../../../../components/inputs/Alert";

const SimpleTextEditor = dynamic(
  () => import("../../../../components/text editor/SimpleTextEditor"),
  { ssr: false }
);

const QuillContent = dynamic(
  () => import("../../../../components/article/QuillContent"),
  { ssr: false }
);

function Answer({
  answer,
  isCorrectAnswer,
  editStatut,
  onSave,
  onEdit,
  onDelete,
  onSetCorrectAnswer,
}) {
  const [editor, setEditor] = useState();
  return (
    <div
      className={`${styles.question_item} ${styles.answer_item}`}
      data-correct-answer={isCorrectAnswer}
    >
      {editStatut.target === answer.id && editStatut.enabled ? (
        <div className={styles.question_editor}>
          <SimpleTextEditor
            onReady={(quill) => setEditor(quill)}
            initialDelta={JSON.parse(answer.content)}
          />
          <SubmitButton text={"Appliquer"} onClick={() => onSave(editor)} />
        </div>
      ) : (
        <QuillContent delta={JSON.parse(answer.content)} />
      )}
      <div style={{ marginTop: "20px" }}>
        <button className={styles.quest_edit} onClick={onEdit}>
          <span>Editer</span>
        </button>
        <button className={styles.quest_delete} onClick={onDelete}>
          <span>Supprimer</span>
        </button>
        <button className={styles.answer_btn} onClick={onSetCorrectAnswer}>
          <span>Réponse correcte</span>
        </button>
      </div>
    </div>
  );
}

function AnswersQCM({ shwo, trainningDocRef, question }) {
  if (!shwo) return null;

  const { currentUser } = useAuth();
  const { adminId, isAdmin } = useIsAdmin(currentUser);

  const [editor, setEditor] = useState();
  const [answers, setAnswers] = useState([]);
  const [loadingAnswers, setLoadingAnswers] = useState(true);

  const [editStatut, setEditStatut] = useState({
    target: undefined,
    enabled: false,
  });

  /** Chargement des reponses */
  useEffect(() => {
    if (!question) return;

    const q = query(
      collection(
        trainningsCollection,
        trainningDocRef,
        "questions",
        question.id,
        "answers"
      ),
      orderBy("createAt")
    );
    const unsubscriber = onSnapshot(q, (snapshot) => {
      setAnswers([]);
      snapshot.forEach((doc) => {
        setAnswers((prev) => [...prev, { id: doc.id, ...doc.data() }]);
      });
    });

    setLoadingAnswers(false);

    return unsubscriber;
  }, [question]);

  async function saveAnswer() {
    const answer = {
      createBy: currentUser.uid,
      createAt: serverTimestamp(),
      adminId: adminId,
      content: JSON.stringify(editor.getContents()),
    };

    try {
      const result = await addDoc(
        collection(
          trainningsCollection,
          trainningDocRef,
          "questions",
          question.id,
          "answers"
        ),
        answer
      );
      await updateDoc(
        doc(trainningsCollection, trainningDocRef, "questions", question.id),
        { answers: arrayUnion(result.id), updateAt: serverTimestamp() }
      );
      editor.setText("");
    } catch (error) {}
  }

  function updateAnswer(quill, answerRef) {
    const answer = {
      updateAt: serverTimestamp(),
      content: JSON.stringify(quill.getContents()),
    };

    updateDoc(
      doc(
        trainningsCollection,
        trainningDocRef,
        "questions",
        question.id,
        "answers",
        answerRef
      ),
      answer
    );
  }

  async function deleteAnswer(answerRef) {
    try {
      await deleteDoc(
        doc(
          trainningsCollection,
          trainningDocRef,
          "questions",
          question.id,
          "answers",
          answerRef
        )
      );
    } catch (error) {}
  }

  async function setCorrectAnswer(answerId) {
    try {
      await updateDoc(
        doc(trainningsCollection, trainningDocRef, "questions", question.id),
        {
          updateAt: serverTimestamp(),
          correctAnswer: answerId,
        }
      );
    } catch (error) {
      console.log("Error: ", error.message);
    }
  }

  return (
    <div className={styles.answer_list}>
      {loadingAnswers ? (
        <LoadingScreen />
      ) : (
        <div className={styles.list}>
          {answers.map((answer) => {
            return (
              <Answer
                key={answer.id}
                isCorrectAnswer={question.correctAnswer === answer.id}
                answer={answer}
                editStatut={editStatut}
                onSave={(quill) => {
                  updateAnswer(quill, answer.id);
                  setEditStatut({ target: undefined, enabled: false });
                }}
                onEdit={() => {
                  setEditStatut({ target: answer.id, enabled: true });
                }}
                onDelete={async () => await deleteAnswer(answer.id)}
                onSetCorrectAnswer={() => setCorrectAnswer(answer.id)}
              />
            );
          })}
          <div className={styles.question_editor}>
            <SimpleTextEditor onReady={(quill) => setEditor(quill)} />
            <SubmitButton text="Ajouter" onClick={saveAnswer} />
          </div>
        </div>
      )}
    </div>
  );
}

function EditQCM({
  trainningDocRef,
  position,
  question,
  editStatut,
  onEdit,
  onSave,
}) {
  const [answerShown, setAnswerShown] = useState(false);
  const [answerEditor, setAnswereditor] = useState();

  return (
    <div className={styles.question_item}>
      <div className={styles.question_pos}>
        {position < 10 ? <span>Q 0{position}</span> : <span>Q {position}</span>}
      </div>
      {editStatut.target === question.id && editStatut.enabled ? (
        <div className={styles.question_editor}>
          <SimpleTextEditor
            initialDelta={JSON.parse(question.content)}
            onReady={(quill) => setAnswereditor(quill)}
          />
          <SubmitButton
            text={"Appliquer"}
            onClick={() => onSave(answerEditor)}
          />
        </div>
      ) : (
        <QuillContent delta={JSON.parse(question.content)} />
      )}
      <div>
        {!answerShown ? (
          <button
            className={styles.answer_action}
            onClick={() => setAnswerShown(true)}
          >
            <span>Afficher les reponses</span>
            <FontAwesomeIcon icon={faAngleDown} />
          </button>
        ) : (
          <button
            className={styles.answer_action}
            onClick={() => setAnswerShown(false)}
          >
            <span>Masquer les reponses</span>
            <FontAwesomeIcon icon={faAngleUp} />
          </button>
        )}
        <button className={styles.quest_edit} onClick={onEdit}>
          <span>Editer</span>
        </button>
      </div>
      <div className={styles.answer_list}>
        <AnswersQCM
          trainningDocRef={trainningDocRef}
          question={question}
          shwo={answerShown}
        />
      </div>
    </div>
  );
}

export default function Questions() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { blog, isOwner } = useTargetBlog();
  const { adminId, isAdmin } = useIsAdmin(currentUser);

  const [trainningDoc, setTrainningDoc] = useState();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [allQuestions, setAllQuestions] = useState([]);

  const [editStatut, setEditStatut] = useState({
    target: undefined,
    enabled: false,
  });

  const [questionEditor, setQuestionEditor] = useState("");
  const [error, setError] = useState();
  const [success, setSuccess] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof router.query.channel !== "string") return;

    getDoc(doc(trainningsCollection, router.query.channel)).then((test) => {
      if (!test.exists()) return router.push("/");
      setTrainningDoc({ id: test.id, ...test.data() });
    });
  }, [router.query.channel]);

  /** Update questions array for each modifications */
  useEffect(() => {
    if (!trainningDoc) return;

    const q = query(
      collection(trainningsCollection, trainningDoc.id, "questions"),
      orderBy("createAt")
    );
    const unsubscriber = onSnapshot(q, (snapshot) => {
      setCurrentQuestion(snapshot.size);
      setAllQuestions([]);
      snapshot.forEach((doc) => {
        setAllQuestions((prev) => [...prev, { id: doc.id, ...doc.data() }]);
      });
    });

    return unsubscriber;
  }, [trainningDoc]);

  async function saveQuestion() {
    setError("");
    setSuccess("");

    const question = {
      adminId: adminId,
      createBy: currentUser.uid,
      createAt: serverTimestamp(),
      answers: [],
      content: JSON.stringify(questionEditor.getContents()),
    };

    setLoading(true);
    try {
      await addDoc(
        collection(trainningsCollection, trainningDoc.id, "questions"),
        question
      );
      questionEditor.setText("");
      setSuccess(`Ajout réussi de la question`);
    } catch (error) {
      setError((prev) => {
        const store = handleFirestoreErrors(error);
        if (store) return store;
        return prev;
      });
    }

    setLoading(false);
  }

  async function updateQuestion(quill, questionRef) {
    const question = {
      updateAt: serverTimestamp(),
      content: JSON.stringify(quill.getContents()),
    };

    try {
      await updateDoc(
        doc(trainningsCollection, trainningDoc.id, "questions", questionRef),
        question
      );
    } catch (error) {
      setError((prev) => {
        const store = handleFirestoreErrors(error);
        if (store) return store;
        return prev;
      });
    }
  }

  const [pubLoading, setPubLoading] = useState(false);
  const [pubError, setPubError] = useState("");

  async function handlePublish() {
    setPubError("");

    if (allQuestions.length !== trainningDoc.questionsNumber) {
      return setPubError(
        `Vous devez ajouter les ${trainningDoc.questionsNumber} questions avant de continuer.`
      );
    }
    if (
      allQuestions.find((q) => q.correctAnswer === null || q.answers.length < 2)
    ) {
      return setPubError(
        "Rassurer vous d'avoir affecter au moins 02 réponses parmis lesquelles une correcte à chacune de vos questions."
      );
    }

    console.log("Saving...");

    setPubLoading(true);
    try {
      await updateDoc(doc(trainningsCollection, trainningDoc.id), {
        published: true,
        updateAt: serverTimestamp(),
      });
      router.push(`/blogs/${router.query.blogId}/trainnings`);
    } catch (error) {
      setError((prev) => {
        const store = handleFirestoreErrors(error);
        if (store) return store;
        return prev;
      });
    }

    setPubLoading(false);
  }

  return (
    <BlogContainer title="Ajouter les questions" robots={"noindex,nofollow"}>
      {!trainningDoc ? (
        <LoadingScreen />
      ) : (
        <div className={styles.wrapper}>
          <div className={styles.infos}>
            <span className="thin-text-3d">{trainningDoc.title}</span>
            <span className="thin-text-3d">
              Question {currentQuestion} / {trainningDoc.questionsNumber}
            </span>
          </div>
          <div className={styles.question_editor}>
            {error && <Alert message={error} type="danger" />}
            {success && <Alert message={success} type="success" />}
            <SimpleTextEditor onReady={(quill) => setQuestionEditor(quill)} />
            <SubmitButton
              text="Ajouter"
              loading={loading}
              progress={25}
              onClick={() => saveQuestion()}
            />
          </div>
          <div className={styles.question_list}>
            {allQuestions.map((question, index) => {
              return (
                <EditQCM
                  key={question.id}
                  position={index + 1}
                  question={question}
                  editStatut={editStatut}
                  onSave={(quill) => {
                    updateQuestion(quill, question.id);
                    setEditStatut({ target: undefined, enabled: false });
                  }}
                  onEdit={() => {
                    setEditStatut({ target: question.id, enabled: true });
                  }}
                  trainningDocRef={trainningDoc.id}
                />
              );
            })}
          </div>
          <div>
            {pubError && <Alert message={pubError} type="danger" />}
            <SubmitButton
              text="Publier"
              loading={pubLoading}
              progress={25}
              onClick={handlePublish}
            />
          </div>
        </div>
      )}
    </BlogContainer>
  );
}
