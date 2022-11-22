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

  return (
    <>
      <Head>
        <title>{title || "Andmag-ground"}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content={robots || "all"} />
        <meta
          name="description"
          content={
            description ||
            "Speed, efficiency, performance and safety are our pride. Whatever the difficulty of your project, we promise you support that meets your expectations"
          }
        />
        <meta name="author" content={author || "Andmag ground"} />
        <meta
          name="keywords"
          content="developer web frontend backend fullstack blog articles posts playlists login profile native mobile windows-platforms iOS Android"
        />
        <meta property="og:site_name" content={"Andmag ground"} />
        <meta property="og:title" content={title || "Andmag-ground"} />
        <meta property="og:type" content={ogType || "website"} />
        <meta property="og:url" content={router.asPath} />
        <meta
          property="og:description"
          content={
            description ||
            "Speed, efficiency, performance and safety are our pride. Whatever the difficulty of your project, we promise you support that meets your expectations"
          }
        />
        <meta property="og:image" content={ogImage || "/images/AG.png"} />
      </Head>
      <header className={styles.container}>
        <AppICon onOpen={onOpen} />
        <Navbar />
        {loadingUser ? (
          <LoadingScreen />
        ) : currentUser ? (
          currentUser.photoURL || currentUser.displayName ? (
            <Account
              photo={currentUser.photoURL}
              pseudo={currentUser.displayName}
            />
          ) : (
            <AwesomeLink
              icon={faSignOut}
              direction="horizontal"
              text="Log Out"
              url="/logout"
              handleClick={(e) => {
                e.preventDefault();
                logout();
              }}
            />
          )
        ) : (
          <AwesomeLink
            icon={faSignIn}
            direction="horizontal"
            text="Log In"
            url="/account/login"
          />
        )}
      </header>
    </>
  );
}
