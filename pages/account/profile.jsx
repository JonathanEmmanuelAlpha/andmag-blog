import {
  faBlog,
  faImagePortrait,
  faStar,
  faUserEdit,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import LoadingScreen from "../../components/inputs/LoadingScreen";
import AwesomeLink from "../../components/links/AwesomeLink";
import SkeletonLayout from "../../components/skeleton-layout/SkeletonLayout";
import { useAuth } from "../../context/AuthProvider";
import { profilesCollection } from "../../firebase";
import toTimeString from "../../helpers/toTimeString";
import styles from "../../styles/account/profile.module.css";

function Stat({ icon, name }) {
  return (
    <div className={styles.items}>
      <FontAwesomeIcon icon={icon} />
      <span>{name}</span>
    </div>
  );
}

function ProfileCard({ profile }) {
  if (!profile) return null;
  return (
    <div className={styles.wrapper}>
      <img src={profile.pp} alt={`${profile.pseudo}.png`} />
      <h2>{profile.pseudo}</h2>
      <div className={styles.links}>
        <AwesomeLink
          reverse
          text="Chager de pseudo"
          direction="horizontal"
          url="/account/profile-edit#pseudo"
          icon={faUserEdit}
        />
        <AwesomeLink
          reverse
          text="Chager de photo de profile"
          direction="horizontal"
          url="/account/profile-edit#pp"
          icon={faImagePortrait}
        />
      </div>
      <div className={styles.stats}>
        {profile.blogId && <Stat icon={faBlog} name="01 blog crée" />}
        <Stat
          icon={faUserGroup}
          name={`${
            profile.followed ? profile.followed.length : 0
          } abonnement(s)`}
        />
        <Stat
          icon={faStar}
          name={`${
            profile.favorites ? profile.favorites.length : 0
          } article(s) favori(s)`}
        />
        <Stat
          icon={faStar}
          name={`${
            profile.testNumber ? profile.testNumber : 0
          } test(s) effectué(s)`}
        />
      </div>
      <h3>
        A rejoint la communauté {toTimeString(profile.createAt.seconds * 1000)}
      </h3>
    </div>
  );
}

export default function Profile() {
  const router = useRouter();
  const { userProfile, loadingProfile } = useAuth();

  const channel = router.query.channel;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof channel !== "string") {
      return setLoading(false);
    }

    getDoc(doc(profilesCollection, channel))
      .then((profile) => {
        setProfile({ id: profile.id, ...profile.data() });
      })
      .catch((error) => {
        return router.push("/account/profile");
      });

    setLoading(false);
  }, [channel]);

  return (
    <SkeletonLayout
      title={"Mon profile"}
      description="Consulter vos informations de profile sur cette page."
    >
      <div className={styles.container}>
        {typeof channel === "string" ? (
          loading ? (
            <LoadingScreen />
          ) : (
            <ProfileCard profile={profile} />
          )
        ) : loadingProfile ? (
          <LoadingScreen />
        ) : (
          <ProfileCard profile={userProfile} />
        )}
      </div>
    </SkeletonLayout>
  );
}
