import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import styles from "../../styles/inputs/Input.module.css";

export default function Input({
  type,
  list,
  label,
  name,
  id,
  value,
  required,
  autoComplete,
  onChange,
  maxChar,
  icon,
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
        <div className={styles.wrapper}>
          {icon && <FontAwesomeIcon icon={icon} />}
          <input
            type={type || "text"}
            list={list}
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
          />
        </div>
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
