import React, { useState } from "react";
import PropTypes from "prop-types";
import styles from "../../styles/comment/CommentInput.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

function CommentInput({ handlePost }) {
  const [comment, setComment] = useState("");

  return (
    <div className={styles.container}>
      <textarea
        placeholder="Tapez votre commentaire"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button
        onClick={() => {
          handlePost(comment.toString());
          setComment("");
        }}
      >
        <FontAwesomeIcon icon={faPaperPlane} />
      </button>
    </div>
  );
}

CommentInput.propTypes = {};

export default CommentInput;
