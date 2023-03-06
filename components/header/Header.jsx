import Head from "next/head";
import React from "react";
import { useRouter } from "next/router";
import AppICon from "../app-icon/AppICon";
import styles from "../../styles/header/Header.module.css";
import Navbar from "../nav-bar/Navbar";
import AwesomeLink from "../links/AwesomeLink";
import { faSignIn, faSignOut } from "@fortawesome/free-solid-svg-icons";
import Account from "../nav-bar/Account";
import { useAuth } from "../../context/AuthProvider";
import LoadingScreen from "../inputs/LoadingScreen";
import { domainName } from "../links/AwesomeLink.type";

export default function Header({
  title,
  description,
  author,
  ogType,
  ogImage,
  onOpen,
  robots,
}) {
  const router = useRouter();
  const { currentUser, loadingUser, logout } = useAuth();

  const desc =
    "Andmag ground est une entreprise de prestation de services axés sur le génie logiciel et la conception UI/UX. Nous offrons donc à nos clients la possibilités de cibler un large éventail de client, augmentant ainsi leur productivité et leur rentabilité.";

  return (
    <>
      <Head>
        <title>{title || "Andmag-ground"}</title>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content={robots || "all"} />
        <meta name="description" content={description || desc} />
        <meta name="author" content={author || "Andmag ground"} />
        <meta
          name="keywords"
          content="developer web frontend backend fullstack blog articles posts playlists login register profile native mobile windows-platforms iOS Android"
        />
        <meta property="og:site_name" content={"Andmag-ground"} />
        <meta property="og:title" content={title || "Andmag-ground"} />
        <meta property="og:type" content={ogType || "website"} />
        <meta property="og:url" content={`${domainName}${router.asPath}`} />
        <meta property="og:description" content={description || desc} />
        <meta property="og:image" content={ogImage || "/logo/AG.png"} />
        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:url"
          content={`${domainName}${router.asPath}`}
        />
        <meta property="twitter:title" content={title || "Andmag-ground"} />
        <meta property="twitter:description" content={description || desc} />
        <meta property="twitter:image" content={ogImage || "/logo/AG.png"} />
      </Head>
      <header className={styles.container}>
        <AppICon onOpen={onOpen} />
        <Navbar />
        <div className={styles.item}>
          {loadingUser ? (
            <LoadingScreen />
          ) : currentUser ? (
            currentUser.emailVerified ? (
              <Account
                photo={currentUser.photoURL}
                pseudo={currentUser.displayName}
              />
            ) : (
              <AwesomeLink
                icon={faSignIn}
                direction="horizontal"
                text="Activer mon compte"
                url="/account/account-activation"
              />
            )
          ) : (
            <AwesomeLink
              icon={faSignIn}
              direction="horizontal"
              text="Se connecter"
              url="/account/login"
            />
          )}
        </div>
      </header>
    </>
  );
}
