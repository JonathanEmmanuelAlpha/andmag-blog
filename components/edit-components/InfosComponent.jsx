import React, { useEffect, useState } from "react";
import { updateProfile } from "firebase/auth";
import { useRouter } from "next/router";
import { useAuth } from "../../context/AuthProvider";
import styles from "../../styles/account/edit.module.css";
import Input from "../inputs/Input";
import {
  handleAuthErrors,
  handleFirestoreErrors,
  profilesCollection,
} from "../../firebase";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faImagePortrait,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import SubmitButton from "../inputs/SubmitButton";
import Alert from "../inputs/Alert";
import dynamic from "next/dynamic";

const SimpleTextEditor = dynamic(
  () => import("../text editor/SimpleTextEditor"),
  { ssr: false }
);

export default function InfosComponent() {
  const router = useRouter();
  const { currentUser, userProfile, initializeAccount } = useAuth();

  const [pseudo, setPseudo] = useState("");
  const [about, setAbout] = useState(null);
  const [editor, setEditor] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [warning, setWarning] = useState("");

  useEffect(() => {
    if (!userProfile) return;

    setPseudo(userProfile.pseudo || "");
    setAbout((prev) => {
      if (userProfile.about) return JSON.parse(userProfile.about);
      return prev;
    });
  }, [userProfile]);

  const handleSubmit = async function (event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setWarning("");

    if (!currentUser.emailVerified) {
      return setError("Vous devez activer votre compte pour continuer.");
    }

    if (pseudo.length < 8)
      return setError(
        "Fournissez un pseudo avec un minimum de 08 charactères."
      );

    if (pseudo.length > 20)
      return setError(
        "Fournissez un pseudo avec un maximum de 20 charactères."
      );

    if (editor.getText() && editor.getText().length < 32)
      return setError("A propos ne peut contenir moins de 32 charactères.");

    setLoading(true);

    let data = null;

    try {
      if (!userProfile || !userProfile.id) {
        await initializeAccount(currentUser);
      }

      if (pseudo !== currentUser.displayName) {
        await updateProfile(currentUser, {
          displayName: pseudo,
        });
        data = { updateAt: serverTimestamp(), pseudo: pseudo };
      }
      if (editor.getContents() !== about) {
        data = { ...data, about: JSON.stringify(editor.getContents()) };
      }

      if (data === null) {
        return setWarning(
          "Vous devez aportez des modifications pour effectuer cettte action."
        );
      }
      await updateDoc(doc(profilesCollection, userProfile.id), data);
      setLoading(false);
      return setSuccess("Modifications appliquées");
    } catch (error) {
      setError((prev) => {
        const auth = handleAuthErrors(error);
        const store = handleFirestoreErrors(error);
        if (auth) return auth;
        if (store) return store;
        return prev;
      });
      setLoading(false);
    }

    setLoading(false);
  };

  return (
    <div className={styles.pers_inf} id="pseudo">
      <div className={styles.hdr}>
        <div>
          <FontAwesomeIcon icon={faInfoCircle} />
        </div>
        <h1>Informations d'identifications</h1>
      </div>
      <form method="post">
        <Input
          label="Pseudo"
          required
          id={"pseudo"}
          icon={faImagePortrait}
          autoComplete="on"
          value={pseudo}
          maxChar={20}
          onChange={(e) => setPseudo(e.target.value)}
        />
        <br />
        <SimpleTextEditor
          initialDelta={about}
          onReady={(editor) => setEditor(editor)}
        />
        <div className={styles.pers_foot}>
          <p>
            Le pseudo est ce qui permet à la communauté de facilement vous
            identifier, renez la peine d'en choisir un qui vous convient le
            mieux remplir.
          </p>
          {error && <Alert type="danger" message={error} />}
          {success && <Alert type="success" message={success} />}
          {warning && <Alert type="warning" message={warning} />}
          <div className={styles.btns_save}>
            <SubmitButton
              onClick={handleSubmit}
              text="Sauvegarder"
              loading={loading}
              progress={25}
            />
            <button className={styles.an_btn} onClick={() => router.push("/")}>
              <span>Annuler</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
