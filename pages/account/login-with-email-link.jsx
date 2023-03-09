import React, { useState } from "react";
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
import { domainName } from "../../components/links/AwesomeLink.type";

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
      await sendSignInLinkToEmail(auth, email);
      window.localStorage.setItem("signin-email", email);
      setSuccess("Un lien de connexion vous a été envoyé par email.");
    } catch (error) {
      setError((prev) => {
        return handleAuthErrors(error);
      });
    }

    setLoading(false);
  };

  return (
    <SkeletonLayout
      title="Se connecter"
      description="Connectez vous en un clic. Entrez votre adresse email dans la zone ci-dessous, nous vous enverrons un lien pour vous connecter."
    >
      <AccountContainer
        title="Bienvenue sur Andmag ground"
        message="Connectez en un clic. Entrez votre adresse email dans la zone ci-dessous, nous vous enverrons un lien pour vous connecter."
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
          </>
        }
        btnMsg="Connection"
        handleSubmit={handleSubmit}
        otherLinks={["register", "forgot-password", "with-password"]}
      />
    </SkeletonLayout>
  );
}

export default Login;
