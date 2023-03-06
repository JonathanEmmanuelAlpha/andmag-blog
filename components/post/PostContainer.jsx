import React from "react";
import PropTypes from "prop-types";
import { PostCard } from "./PostCard";
import styles from "../../styles/post/PostContainer.module.css";
import LoadingScreen from "../inputs/LoadingScreen";

function PostContainer(props) {
  const { community } = useCommunity();
  const { currentUserProfile, currentUser } = useAuth();

  const { publications, loadingPublications } = usePublications(
    community?.id,
    currentUserProfile,
    currentUser?.uid
  );

  return (
    <div className={styles.pub_content}>
      {loadingPublications ? (
        <LoadingScreen />
      ) : (
        publications.map((pub) => {
          return (
            <PostCard
              key={pub.id}
              pub={pub}
              showLightBox={props.showLightBox}
            />
          );
        })
      )}
    </div>
  );
}

PostContainer.propTypes = {
  showLightBox: PropTypes.func.isRequired,
};
