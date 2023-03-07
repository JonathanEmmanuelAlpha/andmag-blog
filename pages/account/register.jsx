import React, { useState } from "react";
import { useRouter } from "next/router";
import AccountContainer, {
  Input,
} from "../../components/skeleton-layout/AccountContainer";
import { faEnvelope, faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "../../context/AuthProvider";
import SkeletonLayout from "../../components/skeleton-layout/SkeletonLayout";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { auth, handleAuthErrors, profilesCollection } from "../../firebase";
import { addDoc, serverTimestamp } from "firebase/firestore";
import { domainName } from "../../components/links/AwesomeLink.type";

export default function Register(props) {
  const router = useRouter();
  const { initializeAccount } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConf, setPasswordConf] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async function (event) {
    event.preventDefault();

    if (password.length < 8)
      return setError(
        "Fournissez un mot de passe avec un minimum de 08 charactères."
      );
    if (password !== passwordConf)
      return setError("Les 02 mots de passes ne correspondent pas.");

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (credential.user) {
        await sendEmailVerification(credential.user);

        await initializeAccount(credential.user);

        setSuccess(
          "Un lien d'activation de compte vous a été envoyé par email."
        );
      }
    } catch (error) {
      setError((prev) => {
        return handleAuthErrors(error);
      });
    }

    setLoading(false);
  };

  return (
    <SkeletonLayout
      title="S'inscrire"
      description="En créant un compte, vous avez la possibilité d'interagir avec d'autre utilisateurs de la communauté."
    >
      <AccountContainer
        title="Créer un nouveau compte"
        Form={
          <>
            <Input
              type="email"
              placeholder="Adresse email"
              value={email}
              isRequired
              handleChange={(e) => setEmail(e.target.value)}
              LeftIcon={<FontAwesomeIcon icon={faEnvelope} />}
            />
            <Input
              type="password"
              placeholder="Mot de passe"
              value={password}
              isRequired
              handleChange={(e) => setPassword(e.target.value)}
              LeftIcon={<FontAwesomeIcon icon={faGear} />}
            />
            <Input
              type="password"
              placeholder="Confirmer le mot de passe"
              value={passwordConf}
              isRequired
              handleChange={(e) => setPasswordConf(e.target.value)}
              LeftIcon={<FontAwesomeIcon icon={faGear} />}
            />
          </>
        }
        btnMsg="S'inscrire"
        handleSubmit={handleSubmit}
        loading={loading}
        error={error}
        success={success}
        otherLinks={["login", "forgot-password", "with-email"]}
      />
    </SkeletonLayout>
  );
}
