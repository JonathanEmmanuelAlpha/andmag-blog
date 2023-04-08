import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import styles from "../../styles/nav-bar/SearchBar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faSearch } from "@fortawesome/free-solid-svg-icons";

function SearchBar(props) {
  const inputRef = useRef();

  useEffect(() => {
    if (!inputRef.current) return;

    const listener = (e) => {
      if (e.code === "Enter") return props.handleSearch();
      if (e.code === "Escape") return props.handleDelete();
    };

    inputRef.current.addEventListener("keydown", listener);

    return () =>
      inputRef.current &&
      inputRef.current.removeEventListener("keydown", listener);
  }, [inputRef]);

  return (
    <div className={styles.wrapper}>
      <button onClick={props.handleDelete}>
        <FontAwesomeIcon icon={faClose} />
      </button>
      <input
        ref={inputRef}
        value={props.value}
        type="text"
        placeholder={
          props.placeholder ? props.placeholder : "Rechercher sur andmag ground"
        }
        onChange={props.handleChange}
      />
      <button onClick={props.handleSearch}>
        <FontAwesomeIcon icon={faSearch} />
      </button>
    </div>
  );
}
SearchBar.propTypes = {
  placeholder: PropTypes.string,
  handleChange: PropTypes.func,
  handleSearch: PropTypes.func,
  handleDelete: PropTypes.func,
};

export default SearchBar;
