import React from "react";
import styles from "../../styles/inputs/Form.module.css";

export default function Form({ title, onSubmit, children }) {
  return (
    <div className={styles.container}>
      <form onSubmit={onSubmit}>
        <h2>{title}</h2>
        {children}
      </form>
    </div>
  );
}
