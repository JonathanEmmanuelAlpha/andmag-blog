import React, { useState } from "react";
import PropTypes from "prop-types";
import styles from "../../styles/skeleton-layout/SkeletonLayout.module.css";
import AwesomeLink from "../links/AwesomeLink";
import {
  faBlog,
  faInfoCircle,
  faPeopleArrows,
  faRegistered,
  faSignOut,
  faStar,
  faUserEdit,
} from "@fortawesome/free-solid-svg-icons";
import Header from "../header/Header";

import { MdRssFeed } from "react-icons/md";
import ToasComponent from "./ToasComponent";
import { useAuth } from "../../context/AuthProvider";
import Footer from "../footer/Footer";

function SideBar({ open }) {
  const { logout } = useAuth();
  return (
    <aside className={styles.sidebar} data-active={open}>
      <nav>
        <ul>
          <li>
            <AwesomeLink
              text="Entrer en contact"
              url="/contact"
              icon={faPeopleArrows}
              direction="horizontal"
            />
          </li>
          <li>
            <AwesomeLink
              text="Editer mon profile"
              url="/account/profile-edit"
              icon={faUserEdit}
              direction="horizontal"
            />
          </li>
          <li>
            <AwesomeLink
              text="Mes favoris"
              url="/settings/favorites"
              icon={faStar}
              direction="horizontal"
            />
          </li>
          <li>
            <AwesomeLink
              text="Créer un blog"
              url="/settings/blog"
              icon={faBlog}
              direction="horizontal"
            />
          </li>
          <li>
            <AwesomeLink
              text="Créer un compte"
              url="/account/register"
              icon={faRegistered}
              direction="horizontal"
            />
          </li>
          <li>
            <AwesomeLink
              text="Se déconnecter"
              url="/logout"
              icon={faSignOut}
              direction="horizontal"
              handleClick={(e) => {
                e.preventDefault();
                logout();
              }}
            />
          </li>
          <li>
            <AwesomeLink
              text="FAQ"
              url="/faq"
              icon={faInfoCircle}
              direction="horizontal"
            />
          </li>
          <li>
            <AwesomeLink
              text="RSS Feed"
              url="/rss.xml"
              custum
              icon={<MdRssFeed size={"35px"} color="#ee802f" />}
              direction="horizontal"
              target="_blank"
              rel="noreferrer"
            />
          </li>
        </ul>
      </nav>
    </aside>
  );
}

function SkeletonLayout({
  title,
  description,
  author,
  ogType,
  ogImage,
  robots,
  children,
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.skeleton}>
      <Header
        author={author}
        description={description}
        ogImage={ogImage}
        ogType={ogType}
        title={title}
        onOpen={() => setOpen(!open)}
        robots={robots}
      />
      <section className={styles.layout}>
        <SideBar open={open} />
        <main>{children}</main>
      </section>
      <ToasComponent />
      <Footer />
    </div>
  );
}

export default SkeletonLayout;
