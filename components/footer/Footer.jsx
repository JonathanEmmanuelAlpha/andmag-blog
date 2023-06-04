import React, { useState } from "react";
import styles from "../../styles/footer/Footer.module.css";
import Image from "next/image";
import {
  EmailIcon,
  FacebookIcon,
  TwiterIcon,
  WhatsappIcon,
} from "../app-icon/AppICon";
import Input from "../inputs/Input";
import { faEnvelope, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { domainName } from "../links/AwesomeLink.type";

function Rights() {
  return (
    <div className={styles.rights}>
      <span>
        2023 &copy;{" "}
        <a href={domainName} target="_blank" rel="noreferrer">
          Andmag-ground{" "}
        </a>
        | All rights reserved.
      </span>
    </div>
  );
}

function Contact() {
  const [email, setEmail] = useState("");
  return (
    <div className={styles.contact}>
      <div className={styles.contact_wrap}>
        <div className={styles.logo}>
          <Image src={"/icon-512x512.png"} width={80} height={80} />
        </div>
        <div className={styles.social_media}>
          <a href="mailto:andmagground@gmail.com">andmagground@gmail.com</a>
          <a href="tel:+237620689433" target="_blank" rel="noopener noreferrer">
            +237 620 689 433
          </a>
          <div>
            <a href="mailto:andmagground@gmail.com">
              <EmailIcon />
            </a>
            <a
              href="https://wa.me/237620689433"
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsappIcon />
            </a>
            <a
              href="https://facebook.com/AndmagGround"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FacebookIcon />
            </a>
            <a
              href="https://twiter.com/AndmagGround"
              target="_blank"
              rel="noopener noreferrer"
            >
              <TwiterIcon />
            </a>
          </div>
        </div>
        <div className={styles.mail}>
          <p>
            <span>Vous souhaitez en savoir plus sur nous ?</span>
            <span>Envoyez nous un email</span>
          </p>
          <Input
            type={"email"}
            autoComplete={"off"}
            icon={faEnvelope}
            label={"Addresse email*"}
            required
            id="email"
            maxChar={128}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button>
            <span>Envoyer</span>
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </div>
      </div>
    </div>
  );
}

function Quick({ title, links }) {
  return (
    <div className={styles.quick_link}>
      <h2>{title}</h2>
      <ul>
        {links.map((link, index) => (
          <li key={index}>
            <Link href={link.href}>{link.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function QuickLinks() {
  return (
    <div className={styles.quick_wrap}>
      <div>
        <Quick
          title={"Andmag ground"}
          links={[
            { href: "/", name: "Accueil" },
            { href: "/blogs", name: "Blogs" },
            { href: "/articles", name: "Articles" },
            { href: "/trainnings", name: "S'entrainner" },
            { href: "/#content-creator", name: "Createur de contenu" },
            { href: "/account/login", name: "Se connecter" },
            { href: "/account/register", name: "Créer un compte" },
            { href: "/account/profile", name: "Mon profile" },
          ]}
        />
        <Quick
          title={"Services frontend"}
          links={[
            { href: "/", name: "Applications iOS" },
            { href: "/blogs", name: "Applications Andoid" },
            { href: "/articles", name: "Plateforme windows universelle" },
            { href: "/trainnings", name: "Applications web" },
            { href: "/#content-creator", name: "Applications hybride" },
          ]}
        />
        <Quick
          title={"Services backend"}
          links={[
            { href: "/account/login", name: "API Rest" },
            { href: "/account/register", name: "API Graphql" },
            { href: "/account/profile", name: "tRCP API" },
            { href: "/account/profile", name: "Google Cloud" },
            { href: "/account/profile", name: "Amazon Web Service" },
            { href: "/account/profile", name: "Firebase" },
            { href: "/account/profile", name: "MongoDB" },
            { href: "/account/profile", name: "Oracle Cloud" },
          ]}
        />
      </div>
    </div>
  );
}

function Footer(props) {
  return (
    <footer className={styles.container}>
      <QuickLinks />
      <Contact />
      <Rights />
    </footer>
  );
}

export default Footer;
