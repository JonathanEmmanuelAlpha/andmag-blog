import React from "react";
import PropTypes from "prop-types";
import styles from "../../styles/nav-bar/SearchBar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

function SearchBar(props) {
  return (
    <div className={styles.wrapper}>
      <button onClick={props.handleSearch}>
        <FontAwesomeIcon icon={faSearch} />
      </button>
      <input
        value={props.value}
        type="search"
        placeholder={
          props.placeholder ? props.placeholder : "Rechercher sur skill upgrade"
        }
        onChange={props.handleChange}
      />
    </div>
  );
}
SearchBar.propTypes = {
  placeholder: PropTypes.string,
  handleChange: PropTypes.func,
  handleSearch: PropTypes.func,
};

export default SearchBar;
