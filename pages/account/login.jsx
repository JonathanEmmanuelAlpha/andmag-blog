import React, { useState } from "react";
import Link from "next/link";
import { faEnvelope, faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { useAuth } from "../../context/AuthProvider";
import SkeletonLayout from "../../components/skeleton-layout/SkeletonLayout";
import AccountContainer, {
  Input,
} from "../../components/skeleton-layout/AccountContainer";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, handleAuthErrors } from "../../firebase";

function Login(props) {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async function (event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (credential.user) {
        if (typeof router.query.next === "string") {
          return router.push(router.query.next);
        }
        return router.push("/account/profile");
      }
    } catch (error) {
      setError((prev) => {
        return handleAuthErrors(error);
      });
    }

    setLoading(false);
  };

  return (
    <SkeletonLayout title="Se connecter à Skill Upgrade" description="">
      <AccountContainer
        title="Bienvenue sur Andmag ground"
        message="Insert the email address and the password used to your
        registration. Note that if you have not yet activated your
        account, you will not be able to use it fully."
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
          </>
        }
        btnMsg="Connection"
        LinkOptions={
          <>
            <Link href="/account/login-with-email-link">
              Se connecter autrement
            </Link>
            <Link href="/account/account-activation">Activer mon compte</Link>
            <Link href="/account/register">Créér un compte</Link>
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

export default Login;
