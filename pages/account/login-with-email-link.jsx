import React, { useState } from "react";
import Link from "next/link";
import PropTypes from "prop-types";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { useAuth } from "../../context/AuthProvider";
import SkeletonLayout from "../../components/skeleton-layout/SkeletonLayout";
import AccountContainer, {
  Input,
} from "../../components/skeleton-layout/AccountContainer";
import {
  sendSignInLinkToEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, handleAuthErrors } from "../../firebase";

function Login(props) {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async function (event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await sendSignInLinkToEmail(auth, email, {
        url:
          typeof router.query.next === "string"
            ? `${domainName}/account/account-activation?next=${router.query.next}`
            : `${domainName}/account/account-activation`,
        handleCodeInApp: true,
      });
      window.localStorage.setItem("signin-email", email);
      setSuccess("A login email has been sent to the email address entered.");
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
        message="This method use links sent by email to facilitate the login
        process especially on mobile devices. Connections are
        persistent by default but you can log out at any time."
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
          </>
        }
        btnMsg="Connection"
        LinkOptions={
          <>
            <Link href="/account/login">Se connecter autrement</Link>
            <Link href="/account/account-activation">Activer mon compte</Link>
            <Link href="/account/register">Créér un compte</Link>
            <Link href="/account/forgotPassword">Mot de passe oublié ?</Link>
          </>
        }
        handleSubmit={handleSubmit}
      />
    </SkeletonLayout>
  );
}

export default Login;
