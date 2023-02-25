import React, { useEffect, useState } from "react";
import {
  faEnvelope,
  faGear,
  faShieldAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import styles from "../../styles/account/edit.module.css";
import { useAuth } from "../../context/AuthProvider";
import SubmitButton from "../inputs/SubmitButton";
import Input from "../inputs/Input";
import Alert from "../inputs/Alert";
import { handleAuthErrors } from "../../firebase";

export default function PersonnalComponent() {
  const router = useRouter();
  const { currentUser, updateUserEmail, updateUserPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConf, setPasswordConf] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!currentUser) return;

    setEmail(currentUser.email);
  }, [currentUser]);

  function updateUserInformations(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 8) {
      return setError("Le mot de passe doit contenir au moins 8 charactères");
    }

    if (password !== passwordConf) {
      return setError("Les deux mots de passes ne correspondent pas");
    }

    const promises = [];
    if (email !== currentUser.email) {
      promises.push(updateUserEmail(email));
    }
    if (password.length >= 8) {
      promises.push(updateUserPassword(email));
    }

    setLoading(true);
    Promise.all(promises)
      .then(() => {
        setSuccess("Modification appliquée avec succès");
      })
      .catch((error) => {
        return setError((prev) => {
          return handleAuthErrors(error);
        });
      });
    setLoading(false);
  }

  return (
    <div className={styles.pers_inf} id="personnal-datas">
      <div className={styles.hdr}>
        <div>
          <FontAwesomeIcon icon={faShieldAlt} />
        </div>
        <h1>Informations personnelles</h1>
      </div>
      <form method="post">
        <Input
          type={"email"}
          label="Email"
          id="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={faEnvelope}
        />
        <div className={styles.two_elt} style={{ marginTop: "20px" }}>
          <Input
            type={"password"}
            label="Mot de passe"
            id="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={faGear}
          />
          <Input
            type={"password"}
            label="Confirmer le mot de passe"
            id="password"
            required
            value={passwordConf}
            onChange={(e) => setPasswordConf(e.target.value)}
            icon={faGear}
          />
        </div>
        <div className={styles.pers_foot}>
          <p>
            Vos informations personnelles ne seront transmisent et ne peuvent
            être consultées par personne.
          </p>
          {error && <Alert type="danger" message={error} />}
          {success && <Alert type="success" message={success} />}
          <div className={styles.btns_save}>
            <SubmitButton
              loading={loading}
              progress={25}
              onClick={updateUserInformations}
              text="Sauvegarder"
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
