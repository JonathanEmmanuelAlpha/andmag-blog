import React, { useEffect, useState } from "react";
import styles from "../../styles/inputs/Textarea.module.css";

export default function Textarea({
  label,
  name,
  id,
  value,
  required,
  autoComplete,
  cols,
  rows,
  onChange,
  maxChar,
}) {
  const [char, setChar] = useState(0);

  useEffect(() => {
    if (typeof value !== "string") return;

    setChar(value.length);
  }, [value]);

  return (
    <div className={styles.container}>
      <fieldset>
        <legend>
          <label htmlFor={id}>
            <span>{label}</span>
            {required && <span style={{ color: "red" }}>*</span>}
          </label>
        </legend>
        <textarea
          placeholder={label}
          name={name}
          id={id}
          required={required}
          autoComplete={autoComplete || "off"}
          value={value}
          onChange={(e) => {
            const __char = e.target.value.length;
            if (__char > maxChar) return;
            setChar(__char);
            onChange(e);
          }}
          cols={cols || "50"}
          rows={rows || "5"}
        />
      </fieldset>
      {maxChar && (
        <div className={styles.max}>
          <span>
            {char} / {maxChar}
          </span>
        </div>
      )}
    </div>
  );
}
