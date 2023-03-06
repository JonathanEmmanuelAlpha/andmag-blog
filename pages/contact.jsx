import { faEnvelope, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";
import Header from "../components/header/Header";
import Alert from "../components/inputs/Alert";
import Form from "../components/inputs/Form";
import Input from "../components/inputs/Input";
import SubmitButton from "../components/inputs/SubmitButton";
import Textarea from "../components/inputs/Textarea";
import SkeletonLayout, {
  Layout,
} from "../components/skeleton-layout/SkeletonLayout";
import styles from "../styles/contact.module.css";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const data = {
      name,
      email,
      message,
    };

    fetch("/api/contact", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.status === 200) {
          setName("");
          setEmail("");
          setMessage("");
          setSuccess("Votre message a bien été envoyé");
        }
      })
      .catch((error) => {
        console.log("Error: ", error);
      });

    setLoading(false);
  }

  return (
    <SkeletonLayout
      title="Entrer en contact"
      description="Si vous souhaitez entrer en contact, parler nous d'un projet ou dites juste salut. Si vous souhaité nous envoyer un mail, remplissez le formulaire ci-dessous ou cliquez sur andmagground@gmail. Vous pouvez également nous trouvez sur les réseaux sociaux."
    >
      <div className={styles.wrapper}>
        <section className={styles.info}>
          <h1>Entrez en contact</h1>
          <p>
            {
              "Si vous souhaité entré en contact, parler nous d'un projet ou dites juste salut. Si vous souhaité nous envoyer un mail, remplissez le formulaire ci-dessous ou cliquez sur "
            }
            <a href="mailto:andmagground@gmail.com">andmagground@gmail</a>. Vous
            pouvez également nous trouvez sur les réseaux sociaux.
          </p>
        </section>
        <section className={styles.form}>
          <form onSubmit={handleSubmit}>
            {error && <Alert message={error} type="danger" />}
            {success && <Alert message={success} type="success" />}
            <div className={styles.both}>
              <Input
                type="text"
                icon={faUserCircle}
                autoComplete="on"
                id="name"
                label={"Entrer votre nom"}
                required
                maxChar={125}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                type="email"
                icon={faEnvelope}
                autoComplete="on"
                id="email"
                label={"Entrer votre email"}
                required
                maxChar={255}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Textarea
              autoComplete="on"
              maxChar={1024}
              rows={5}
              id="message"
              label={"Taper votre message ici"}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <SubmitButton loading={loading} progress={25} text="Envoyer" />
          </form>
        </section>
        <section className={styles.info}>
          <h2>Réseaux sociaux</h2>
          <p>
            {
              " suivez moi sur Whatsapp, Facebook et Twitter pour plus d'informations"
            }
          </p>
          <div>
            <a
              href="https://wa.me/237620689433"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.wh}
            >
              <img src="/icons/whatsapp.png" alt="whatsapp.png" />
              <span>whatsapp</span>
            </a>
            <a
              href="https://facebook.com/AndmagGround"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.fa}
            >
              <img src="/icons/facebook.png" alt="facebook.png" />
              <span>facebook</span>
            </a>
            <a
              href="https://twiter.com/AndmagGround"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.tw}
            >
              <img src="/icons/twiter.png" alt="twiter.png" />
              <span>twiter</span>
            </a>
          </div>
        </section>
      </div>
    </SkeletonLayout>
  );
}
