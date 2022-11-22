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
import Textarea from "../inputs/Textarea";

export default function InfosComponent() {
  const router = useRouter();
  const { currentUser, userProfile } = useAuth();

  const [pseudo, setPseudo] = useState("");
  const [about, setAbout] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [warning, setWarning] = useState("");

  useEffect(() => {
    if (!userProfile) return;

    setPseudo(userProfile.pseudo || "");
    setPseudo(userProfile.about || "");
  }, [userProfile]);

  const handleSubmit = async function (event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setWarning("");

    if (!userProfile || !userProfile.id) return;

    if (pseudo.length < 8)
      return setError(
        "You need to provide a pseudo with a minimum of 08 characters."
      );

    if (pseudo.length > 20)
      return setError(
        "You need to provide a pseudo with a maximum of 20 characters."
      );

    if (about.length < 32)
      return setError("About can not contain less than 32 characters.");

    if (about.length > 255)
      return setError("About can not contain more than 255 characters.");

    setLoading(true);

    let data = null;

    try {
      if (pseudo !== currentUser.displayName) {
        await updateProfile(currentUser, {
          displayName: pseudo,
        });
        data = { updateAt: serverTimestamp(), pseudo: pseudo };
      }
      if (pseudo !== userProfile.about) {
        data = { ...data, about: about };
      }

      if (data !== null) {
        await updateDoc(doc(profilesCollection, userProfile.id), data);
        return setSuccess("Modifications applied successfully");
      }
      return setWarning(
        "You need to change some of these fields to proccess an update"
      );
    } catch (error) {
      setError((prev) => {
        const auth = handleAuthErrors(error);
        const store = handleFirestoreErrors(error);
        if (auth) return auth;
        if (store) return store;
        return prev;
      });
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
        <Textarea
          autoComplete="on"
          label={"A propos de vous"}
          id="about"
          maxChar={255}
          value={about}
          onChange={(e) => setPseudo(e.target.value)}
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
