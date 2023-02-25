import { useRouter } from "next/router";
import React, { useState } from "react";
import styles from "../../styles/account/edit.module.css";
import { v4 } from "uuid";
import { updateProfile } from "firebase/auth";
import { useAuth } from "../../context/AuthProvider";
import {
  fileUpload,
  handleStorageErrors,
  profilesCollection,
} from "../../firebase";
import SubmitButton from "../inputs/SubmitButton";
import Uploader from "../images-manipulation/Uploader";
import Alert from "../inputs/Alert";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";

export default function PPComponent({ ppReady }) {
  const router = useRouter();
  const { currentUser, userProfile, initializeAccount } = useAuth();

  const [picture, setPicture] = useState();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async function (event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!currentUser.emailVerified) {
      return setError("Vous devez activer votre compte pour continuer.");
    }

    if (!(picture instanceof Blob))
      return setError(
        "S'il vous plait, veuillez fournir une image pour continuer."
      );

    setLoading(true);
    try {
      if (!userProfile || !userProfile.id) {
        await initializeAccount(currentUser);
      }
      const fileRef = userProfile.ppRef ? userProfile.ppRef : v4();

      const url = await fileUpload(
        `profiles/${fileRef}`,
        picture,
        currentUser.uid
      );
      if (!url)
        return setError("Echec de la mise à jour de le photo de profile.");

      await updateProfile(currentUser, {
        photoURL: url,
      });

      await updateDoc(doc(profilesCollection, userProfile.id), {
        updateAt: serverTimestamp(),
        ppRef: fileRef,
        pp: url,
      });

      setSuccess("Modifications appliquées avec succès.");
    } catch (error) {
      setError((prev) => {
        const auth = handleAuthErrors(error);
        const store = handleFirestoreErrors(error);
        const storage = handleStorageErrors(error);

        if (auth) return auth;
        if (store) return store;
        if (storage) return storage;
        return prev;
      });
    }

    setLoading(false);
  };

  return (
    <div className={styles.pp_edit} id="pp">
      <Uploader
        openUploader
        label="pp-upload"
        message="Changer de photo de profile"
        inforMessage="Cliquer ou glisser déposer une image dans cette zone"
        onFilesUpload={(files) => setPicture(files[0])}
      />
      {error && <Alert type="danger" message={error} />}
      {success && <Alert type="success" message={success} />}
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
  );
}
