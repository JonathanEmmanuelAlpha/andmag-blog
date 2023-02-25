import React from "react";
import PropTypes from "prop-types";
import styles from "../../styles/trainning/ActivitiesContainer.module.css";
import SkeletonLayout from "../skeleton-layout/SkeletonLayout";
import SearchBar from "../nav-bar/SearchBar";

function ActivitiesContainer(props) {
  return (
    <SkeletonLayout title={props.pageTitle} description={props.pageDesc}>
      <div className={styles.container}>
        {!props.hideBar ? (
          <div className={styles.search_bar}>
            <SearchBar
              value={props.value}
              placeholder={props.searchHolder}
              handleChange={props.onchange}
              handleSearch={props.handleSearch}
            />
          </div>
        ) : null}
        <div className={styles.wrapper}>{props.children}</div>
      </div>
    </SkeletonLayout>
  );
}

ActivitiesContainer.propTypes = {
  hideBar: PropTypes.bool,
  pageTitle: PropTypes.string,
  pageDesc: PropTypes.string,
  searchHolder: PropTypes.string,
  value: PropTypes.string,
  handleSearch: PropTypes.func,
  onchange: PropTypes.func,
};

export default ActivitiesContainer;
