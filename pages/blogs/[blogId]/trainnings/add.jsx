import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import styles from "../../../../styles/trainning/trainning.module.css";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { v4 } from "uuid";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperclip,
  faPeopleCarryBox,
  faPeopleGroup,
  faPerson,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../../../context/AuthProvider";
import Input from "../../../../components/inputs/Input";
import Textarea from "../../../../components/inputs/Textarea";
import RadioInput from "../../../../components/inputs/RadioInput";
import Alert from "../../../../components/inputs/Alert";
import SubmitButton from "../../../../components/inputs/SubmitButton";
import BlogContainer from "../../../../components/blog/BlogContainer";
import Form from "../../../../components/inputs/Form";
import useIsAdmin from "../../../../hooks/useIsAdmin";
import { blogsCollection, trainningsCollection } from "../../../../firebase";
import { useTargetBlog } from "../../../../context/BlogProvider";
import useTrainning from "../../../../hooks/useTrainning";

export default function trainning() {
  const { currentUser } = useAuth();
  const { blog, isOwner } = useTargetBlog();
  const { adminId, isAdmin } = useIsAdmin(currentUser);
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState(0);
  const [questionsNumber, setQuestionNumber] = useState(0);
  const [target, setTarget] = useState("public");

  const { currentTrainning } = useTrainning(
    router.query.blogId,
    1,
    1,
    router.query.channel
  );
  useEffect(() => {
    if (!currentTrainning || !currentTrainning.doc) return;

    setTitle(currentTrainning.doc.title);
    setDescription(currentTrainning.doc.description);
    setTime(currentTrainning.doc.time);
    setQuestionNumber(currentTrainning.doc.questionsNumber);
    setTarget(currentTrainning.doc.target);
  }, [currentTrainning, currentTrainning.doc]);

  const [error, setError] = useState();
  const [success, setSuccess] = useState();
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError("");
    setSuccess("");

    if (target !== "public" || target !== "community") {
      return setError("Portée de session invalide");
    }
    if (title.length > 30 || title.length < 10) {
      return setError(
        "L'intitulé ne doit pas contenir moins de 10 ou plus de 30 charactères"
      );
    }
    if (description.length > 120 || description.length < 20) {
      return setError(
        "La description ne doit pas contenir moins de 20 ou plus de 120 charactères"
      );
    }
    if (time > 60 || time < 2) {
      return setError(
        "La durée du test doit être comprise entre 02 et 60 minutes"
      );
    }

    const trainning = {
      createBy: currentUser.uid,
      createAt: serverTimestamp(),
      adminId: adminId,
      blogId: blog.id,
      title: title,
      description: description,
      time: time,
      questionsNumber: questionsNumber,
      target: target,
    };

    setLoading(true);

    try {
      const result = await addDoc(trainningsCollection, trainning);
      await updateDoc(doc(blogsCollection, blog.id), {
        tests: arrayUnion(result.id),
        mostRecentTest: result.id,
        updateAt: serverTimestamp(),
      });

      setSuccess(`Création réussi du test`);
      router.push(
        `/blogs/${router.query.blogId}/trainnings/add-questions?channel=${result.id}`
      );
    } catch (error) {
      console.log("Error: ", error);
      setError(error.message);
    }

    setLoading(false);
  }

  async function update() {
    setError("");
    setSuccess("");

    if (title.length > 30 || title.length < 10) {
      return setError(
        "L'intitulé ne doit pas contenir moins de 10 ou plus de 30 charactères"
      );
    }
    if (description.length > 120 || description.length < 20) {
      return setError(
        "La description ne doit pas contenir moins de 20 ou plus de 120 charactères"
      );
    }
    if (time > 60 || time < 2) {
      return setError(
        "La durée du test doit être comprise entre 02 et 60 minutes"
      );
    }

    let data = {};
    if (target !== currentTrainning.doc.target)
      data = { ...data, target: target };
    if (title !== currentTrainning.doc.title) data = { ...data, title: title };
    if (description !== currentTrainning.doc.description)
      data = { ...data, description: description };
    if (time !== currentTrainning.doc.time) data = { ...data, time: time };
    if (questionsNumber !== currentTrainning.doc.questionsNumber)
      data = { ...data, questionsNumber: questionsNumber };

    setLoading(true);
    try {
      await updateDoc(doc(trainningsCollection, currentTrainning.doc.id), {
        updateAt: serverTimestamp(),
        ...data,
      });
      setSuccess("Modifications appliquées avec success");
      router.push(
        `/blogs/${router.query.blogId}/trainnings/add-questions?channel=${currentTrainning.doc.id}`
      );
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <BlogContainer
      title={
        currentTrainning.doc && currentTrainning.doc.id
          ? "Mise à jour d'une session"
          : "Nouvelle session d'entrainnement"
      }
      robots={"noindex,nofollow"}
    >
      <div className={styles.wrapper}>
        <Form
          title={"Nouveau test"}
          onSubmit={async (event) => {
            event.preventDefault();
            if (currentTrainning && currentTrainning.doc.id) {
              return await update();
            }
            return await handleSubmit();
          }}
        >
          <Input
            type={"text"}
            label="Intitulé"
            required
            id={"title"}
            value={title}
            icon={faPaperclip}
            maxChar={30}
            onChange={(event) => setTitle(event.target.value)}
          />
          <Textarea
            required
            label="Description"
            id="decription"
            value={description}
            maxChar={120}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className={styles.two_items}>
            <Input
              label="Durée en minutes"
              required
              maxChar={2}
              type="number"
              id={"time"}
              value={time}
              onChange={(e) => setTime(parseInt(e.target.value))}
            />
            <Input
              label="Nombre de questions"
              maxChar={2}
              required
              type="number"
              id={"questions"}
              value={questionsNumber}
              onChange={(e) => setQuestionNumber(parseInt(e.target.value))}
            />
          </div>

          <fieldset>
            <legend>Portée de la session</legend>
            <div>
              <RadioInput
                label="Ma communauté"
                icon={<FontAwesomeIcon icon={faUsers} />}
                styleWidth="150px"
                styleHeight="100px"
                name="test-target"
                id="community"
                value={target}
                active={"community" === target}
                handleChange={(event) => setTarget("community")}
              />
              <RadioInput
                label="Publique"
                icon={<FontAwesomeIcon icon={faPeopleGroup} />}
                styleWidth="150px"
                styleHeight="100px"
                name="test-target"
                id="public"
                value={target}
                active={"public" === target}
                handleChange={(event) => setTarget("public")}
              />
            </div>
          </fieldset>

          {error && <Alert type="danger" message={error} />}
          {success && <Alert type="success" message={success} />}
          <div className={styles.btns}>
            <SubmitButton
              loading={loading}
              progress={25}
              text={currentTrainning.doc?.id ? "Sauvegarder" : "Créer"}
            />
          </div>
        </Form>
      </div>
    </BlogContainer>
  );
}
