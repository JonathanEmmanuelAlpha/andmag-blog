import React, { useState } from "react";
import { useRouter } from "next/router";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AccountContainer, {
  Input,
} from "../../components/skeleton-layout/AccountContainer";
import SkeletonLayout from "../../components/skeleton-layout/SkeletonLayout";
import { useAuth } from "../../context/AuthProvider";
import useDebounceEffect from "../../hooks/useDebounceEffect";
import {
  isSignInWithEmailLink,
  sendEmailVerification,
  signInWithEmailLink,
} from "firebase/auth";
import { auth, handleAuthErrors } from "../../firebase";
import LoadingScreen from "../../components/inputs/LoadingScreen";
import { domainName } from "../../components/links/AwesomeLink.type";

export default function Activation(props) {
  const router = useRouter();
  const { currentUser } = useAuth();

  const [process, setProcess] = useState(true);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSucces] = useState("");

  useDebounceEffect(() => {
    setProcess(true);

    if (isSignInWithEmailLink(auth, window.location.href)) {
      const email = window.localStorage.getItem("signin-email");
      if (!email) {
        return setProcess(false);
      }

      signInWithEmailLink(auth, email, window.location.href)
        .then((result) => {
          window.localStorage.removeItem("signin-email");
          if (typeof router.query.next === "string") {
            return router.push(router.query.next);
          }
          return router.push("/account/profile");
        })
        .catch((error) => {
          setError((prev) => {
            return handleAuthErrors(error);
          });
        });
    }
    setProcess(false);
  }, []);

  const handleSubmit = async function (event) {
    event.preventDefault();
    setSucces("");
    setError("");

    if (currentUser && currentUser.emailVerified)
      return router.push("/account/profile");

    setLoading(true);

    if (isSignInWithEmailLink(auth, window.location.href)) {
      signInWithEmailLink(auth, email, window.location.href)
        .then((result) => {
          if (typeof router.query.next === "string") {
            return router.push(router.query.next);
          }
          return router.push("/account/profile");
        })
        .catch((error) => {
          setError((prev) => {
            return handleAuthErrors(error);
          });
        });
    } else {
      try {
        await sendEmailVerification(currentUser);
        setSucces(
          "Un lien d'activation de compte vous a été envoyé par email."
        );
      } catch (error) {
        setError((prev) => {
          return handleAuthErrors(error);
        });
      }
    }
    setLoading(false);
  };
  return (
    <SkeletonLayout title="Activer mon compte" description="">
      {process ? (
        <LoadingScreen />
      ) : (
        <AccountContainer
          title={"Activer votre compte"}
          message={
            "It will appear that you switched devices during the login process. Please provide your email again for confirmation."
          }
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
          btnMsg="Activer"
          handleSubmit={handleSubmit}
          error={error}
          loading={loading}
          success={success}
          otherLinks={["register"]}
        />
      )}
    </SkeletonLayout>
  );
}
