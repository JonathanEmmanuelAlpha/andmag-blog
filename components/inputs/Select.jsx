import React from "react";
import Input from "./Input";

export default function Select({
  list,
  label,
  name,
  id,
  required,
  value,
  onChange,
  children,
}) {
  return (
    <div style={{ width: "100%" }}>
      <datalist id={list}>{children}</datalist>
      <Input
        list={list}
        label={label}
        id={id}
        name={name}
        required={required}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
