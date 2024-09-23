import { faShareSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "../../styles/actions/Popup.module.css";
import React, { useEffect, useState } from "react";
import Popup from "./Popup";
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  FacebookMessengerIcon,
  FacebookMessengerShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  PinterestIcon,
  PinterestShareButton,
  RedditIcon,
  RedditShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "next-share";
import { useRouter } from "next/router";

export default function ShareButton({ popupOnTop, generateOnClick, metas }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function metaAdder(queryProperty, value) {
    // Get an element if it exists already
    let element = document.querySelector(`meta[${queryProperty}]`);

    // Check if the element exists
    if (element) {
      // If it does just change the content of the element
      element.setAttribute("content", value);
    } else {
      // It doesn't exist so lets make a HTML element string with the info we want
      element = `<meta ${queryProperty} content="${value}" />`;

      // And insert it into the head
      document.head.insertAdjacentHTML("beforeend", element);
    }
  }

  function handleClick() {
    setOpen(!open);

    if (!generateOnClick || !metas) return;

    metas.forEach((meta) => {
      metaAdder(meta.property, meta.value);
    });
  }

  return (
    <div className={styles.share_container}>
      <button className={styles.button} onClick={handleClick}>
        <FontAwesomeIcon icon={faShareSquare} />
        <span>Partagez</span>
      </button>
      <Popup
        open={open}
        onClose={() => setOpen(!open)}
        onTop={popupOnTop}
        title="Partagez sur l'une des plateformes"
      >
        <div className={styles.share_wrap}>
          <div className={styles.share_item}>
            <EmailShareButton url={router.asPath}>
              <EmailIcon round />
              <span>Email</span>
            </EmailShareButton>
          </div>
          <div className={styles.share_item}>
            <FacebookShareButton url={router.asPath}>
              <FacebookIcon round />
              <span>Facebook</span>
            </FacebookShareButton>
          </div>
          <div className={styles.share_item}>
            <FacebookMessengerShareButton url={router.asPath}>
              <FacebookMessengerIcon round />
              <span>Messenger</span>
            </FacebookMessengerShareButton>
          </div>
          <div className={styles.share_item}>
            <LinkedinShareButton url={router.asPath}>
              <LinkedinIcon round />
              <span>Linkedin</span>
            </LinkedinShareButton>
          </div>
          <div className={styles.share_item}>
            <RedditShareButton url={router.asPath}>
              <RedditIcon round />
              <span>Reddit</span>
            </RedditShareButton>
          </div>
          <div className={styles.share_item}>
            <TwitterShareButton url={router.asPath}>
              <TwitterIcon round />
              <span>Twitter</span>
            </TwitterShareButton>
          </div>
          <div className={styles.share_item}>
            <WhatsappShareButton url={router.asPath}>
              <WhatsappIcon round />
              <span>Whatsapp</span>
            </WhatsappShareButton>
          </div>
          <div className={styles.share_item}>
            <TelegramShareButton url={router.asPath}>
              <TelegramIcon round />
              <span>Telegram</span>
            </TelegramShareButton>
          </div>
          <div className={styles.share_item}>
            <PinterestShareButton url={router.asPath}>
              <PinterestIcon round />
              <span>Pinterest</span>
            </PinterestShareButton>
          </div>
        </div>
      </Popup>
    </div>
  );
}
