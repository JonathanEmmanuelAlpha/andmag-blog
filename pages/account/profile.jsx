import {
  faBlog,
  faImagePortrait,
  faNewspaper,
  faPeoplePulling,
  faStar,
  faUserEdit,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dashify from "dashify";
import { getDocs, query, where } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Infos from "../../components/inputs/Infos";
import LoadingScreen from "../../components/inputs/LoadingScreen";
import AwesomeLink from "../../components/links/AwesomeLink";
import SkeletonLayout from "../../components/skeleton-layout/SkeletonLayout";
import { showErrorToast } from "../../components/skeleton-layout/ToasComponent";
import { useAuth } from "../../context/AuthProvider";
import toTimeString from "../../helpers/toTimeString";
import styles from "../../styles/account/profile.module.css";
import { profilesCollection } from "../../libs/database";
import dynamic from "next/dynamic";
import useBlog from "../../hooks/useBlog";
import useBlogFollowers from "../../hooks/useBlogFollowers";
import Image from "next/image";

const QuillContent = dynamic(
  () => import("../../components/article/QuillContent"),
  { ssr: false }
);

function Stat({ icon, name }) {
  return (
    <div className={styles.items}>
      <FontAwesomeIcon icon={icon} />
      <span>{name}</span>
    </div>
  );
}

function ProfileCard({ profile }) {
  const { blog, loadingBlog } = useBlog(profile.blogId);
  const followers = useBlogFollowers(blog?.id);

  return (
    <div className={styles.wrapper}>
      <Image
        className="skeleton"
        src={profile.pp}
        alt={`${profile.pseudo} - pseudo`}
        priority
        width={150}
        height={150}
      />
      <section>
        <div className={styles.infos_gp}>
          <div className={styles.group}>
            <h1>{profile.pseudo}</h1>
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
          </div>
          {profile.blogId && (
            <div className={styles.stats}>
              {loadingBlog && <LoadingScreen />}
              {!loadingBlog && (
                <>
                  <Stat icon={faUserGroup} name={`${followers} abonné(s)`} />
                  <Stat
                    icon={faNewspaper}
                    name={`${
                      blog.articles ? blog.articles.length : 0
                    } article(s)`}
                  />
                  <Stat
                    icon={faPeoplePulling}
                    name={`${blog.tests ? blog.tests.length : 0} test(s)`}
                  />
                </>
              )}
            </div>
          )}
        </div>
        <h3>
          Est devenu membre {toTimeString(profile.createAt.seconds * 1000)}
        </h3>
      </section>
    </div>
  );
}

function ProfileContainer({ profile }) {
  return (
    <div className={styles.container}>
      <ProfileCard profile={profile} />
      {profile.about && (
        <article>
          <QuillContent delta={JSON.parse(profile.about)} />
        </article>
      )}
    </div>
  );
}

function Profile({ profile, notFound }) {
  const router = useRouter();
  const { userProfile, loadingProfile } = useAuth();

  return (
    <SkeletonLayout
      title={
        profile
          ? `${profile.pseudo} - profile`
          : userProfile
          ? `${userProfile.pseudo} - profile`
          : "loading profile..."
      }
      description={
        profile
          ? `Consulter les informations de profile de ${profile.pseudo}`
          : userProfile
          ? `Consulter les informations de profile de ${userProfile.pseudo}`
          : "loading profile..."
      }
      ogImage={profile ? profile.pp : userProfile ? userProfile.pp : "/"}
      ogType={"profile"}
    >
      {profile && <ProfileContainer profile={profile} />}
      {!profile && loadingProfile && <LoadingScreen />}
      {!profile && !loadingProfile && (
        <ProfileContainer profile={userProfile} />
      )}
      {notFound && (
        <Infos
          title={"Aucun profile ne correspond"}
          message={`Aucun utilisateur ne porte le pseudo ${pseudo}. Ceci peut être du à un changement récent du pseudo.`}
          link1={{
            text: "Mon profile",
            url: "/account/profile",
          }}
          link2={{
            text: "Modifier mon profile",
            url: "/account/profile-edit",
          }}
        />
      )}
    </SkeletonLayout>
  );
}

export async function getServerSideProps(context) {
  if (!context.query || typeof context.query.pseudo !== "string") {
    return {
      props: {},
    };
  }

  const results = await profilesCollection
    .where("pseudo", "==", context.query.pseudo)
    .limit(1)
    .get();
  const profile = results.docs[0];

  if (!profile.exists) {
    return {
      props: {
        notFound: true,
      },
    };
  }

  return {
    props: {
      profile: {
        ...profile.data(),
        id: profile.id,
        createAt: profile.data().createAt.seconds,
        updateAt: profile.data().updateAt
          ? profile.data().updateAt.seconds
          : null,
      },
    },
  };
}

export default Profile;
