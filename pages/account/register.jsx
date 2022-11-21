import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import AccountContainer, {
  Input,
} from "../../components/skeleton-layout/AccountContainer";
import { faEnvelope, faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "../../context/AuthProvider";
import SkeletonLayout from "../../components/skeleton-layout/SkeletonLayout";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, handleAuthErrors, profilesCollection } from "../../firebase";
import { addDoc, serverTimestamp } from "firebase/firestore";

export default function Register(props) {
  const router = useRouter();
  const { register } = useAuth();

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
        "You need to provide a password with a minimum of 08 characters."
      );
    if (password !== passwordConf)
      return setError("Both password does not matchs");

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
        await sendEmailVerification(credential.user, {
          url:
            typeof router.query.next === "string"
              ? `${domainName}${router.query.next}`
              : `${domainName}/account/profile-edit`,
          handleCodeInApp: true,
        });

        await updateProfile(credential.user, {
          displayName: "Unknown-pseudo",
          photoURL: "/images/default-pp.png",
        });

        await addDoc(profilesCollection, {
          ppRef: null,
          createAt: serverTimestamp(),
        });

        setSuccess("An account activation link has been sent to your email.");
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
      title="Andmag-gound - Register"
      description="Use Skill Upgrade to improve your skill, challenge your friends and the rest of the world !"
    >
      <AccountContainer
        title="Créer un nouveau compte"
        Form={
          <>
            <Input
              type="email"
              placeholder="Addresse email"
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
        LinkOptions={
          <>
            <Link href="/account/login">Se connecter</Link>
            <Link href="/account/forgotPassword">Mot de passe oublié ?</Link>
          </>
        }
        handleSubmit={handleSubmit}
        loading={loading}
        error={error}
        success={success}
      />
    </SkeletonLayout>
  );
}
