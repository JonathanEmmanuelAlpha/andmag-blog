import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useFAQ } from "../../context/FAQProvider";
import styles from "../../styles/faq/FaqMenu.module.css";
import LoadingScreen from "../inputs/LoadingScreen";
import { domainName } from "../links/AwesomeLink.type";

function Menu({ route, name, subMenus }) {
  const router = useRouter();
  const [open, setOpen] = useState(
    router.asPath === `${domainName}/faq/${route}`
  );

  return (
    <div className={styles.menu}>
      <div className={styles.mark} />
      <div className={styles.main_menu}>
        <Link href={`${domainName}/faq/${route}`}>
          <a data-active={router.asPath === `${domainName}/faq/${route}`}>
            {name}
          </a>
        </Link>
        <FontAwesomeIcon
          icon={open ? faAngleUp : faAngleDown}
          onClick={() => setOpen(!open)}
        />
      </div>
      <div className={styles.submenu} data-active={open}>
        <ul>
          {subMenus.length > 0
            ? subMenus.map((menu, index) => (
                <li key={index}>
                  <div className={styles.sub_mark} />
                  <Link href={`${domainName}/faq/${route}#${menu?.route}`}>
                    <a
                      data-active={
                        router.asPath ===
                        `${domainName}/faq/${route}#${menu?.route}`
                      }
                    >
                      {menu?.name}
                    </a>
                  </Link>
                </li>
              ))
            : null}
        </ul>
      </div>
    </div>
  );
}

export default function FaqMenu() {
  const router = useRouter();
  const { loadingItems, getCategoryItem } = useFAQ();

  const natives = getCategoryItem("native-app");
  const webs = getCategoryItem("web-pwa");
  const apis = getCategoryItem("api");
  const others = getCategoryItem("others");

  return (
    <nav className={styles.container}>
      {loadingItems ? (
        <LoadingScreen />
      ) : (
        <ul>
          <li>
            {natives.length > 0 ? (
              <Menu
                name={"Applications Natives"}
                route="native-app"
                subMenus={natives}
              />
            ) : null}
          </li>
          <li>
            {webs.length > 0 ? (
              <Menu
                name={"Applications Web & PW"}
                route="web-pwa"
                subMenus={webs}
              />
            ) : null}
          </li>
          <li>
            {apis.length > 0 ? (
              <Menu name={"Constructions d'API"} route="api" subMenus={apis} />
            ) : null}
          </li>
          <li>
            {others.length > 0 ? (
              <Menu
                name={"Autres préoccupations"}
                route="others"
                subMenus={others}
              />
            ) : null}
          </li>
        </ul>
      )}
    </nav>
  );
}
