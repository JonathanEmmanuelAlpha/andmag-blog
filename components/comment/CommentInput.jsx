import React, { useState } from "react";
import PropTypes from "prop-types";
import styles from "../../styles/comment/CommentInput.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import dynamic from "next/dynamic";
import { useAuth } from "../../context/AuthProvider";
import Link from "next/link";
import { domainName } from "../links/AwesomeLink.type";
import { useRouter } from "next/router";
import LoadingScreen from "../inputs/LoadingScreen";

const SimpleTextEditor = dynamic(
  () => import("../text editor/SimpleTextEditor"),
  { ssr: false }
);

function CommentInput({ handlePost }) {
  const router = useRouter();
  const { currentUser, loadingUser } = useAuth();

  const [editor, setEditor] = useState(null);

  return (
    <div className={styles.container}>
      <SimpleTextEditor
        onReady={(editor) => {
          setEditor(editor);
        }}
      />
      <div className={styles.btns}>
        <button
          onClick={() => {
            handlePost(JSON.stringify(editor.getContents()));
            editor.setText("\n");
          }}
        >
          <span>Publier</span>
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
        {loadingUser && <LoadingScreen />}
        {!loadingUser && !currentUser && (
          <Link href={`${domainName}/account/login?next=${router.asPath}`}>
            <a>
              <span>Se connecter</span>
              <FontAwesomeIcon icon={faSignInAlt} />
            </a>
          </Link>
        )}
      </div>
    </div>
  );
}

export default CommentInput;
