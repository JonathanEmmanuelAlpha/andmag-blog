import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import AccountContainer, {
  Input,
} from "../../components/skeleton-layout/AccountContainer";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "../../context/AuthProvider";
import SkeletonLayout from "../../components/skeleton-layout/SkeletonLayout";

function ForgotPassword(props) {
  const { currentUser, resetPassword } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setSuccess("");
    setError("");

    if (email.length < 6)
      return setError("Fournissez une addresse email valide.");

    setLoading(true);
    try {
      await resetPassword(email);
      setSuccess("Un lien vous a été envoyé par email.");
    } catch (error) {
      setError((prev) => {
        return handleAuthErrors(error);
      });
    }
    setLoading(false);
  }

  return (
    <SkeletonLayout title="Mot de passe oublié ?" description="">
      <AccountContainer
        title="Vous Avez Oublié Votre Mot de Passe ?"
        message="Entrez votre adresse email dans la zone de texte ci-dessous. Un lien vous sera envoyé pour finaliser la procédure."
        Form={
          <>
            <Input
              type="email"
              placeholder="Adresse email"
              isRequired
              value={email}
              handleChange={(e) => setEmail(e.target.value)}
              LeftIcon={<FontAwesomeIcon icon={faEnvelope} />}
            />
          </>
        }
        btnMsg="commencer"
        LinkOptions={
          <>
            <Link href="/account/login">Se connecter</Link>
            <Link href="/account/account-activation">Activer mon compte</Link>
            <Link href="/account/register">Créér un compte</Link>
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

export default ForgotPassword;
