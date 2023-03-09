import { getDocs, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Card from "../../components/case-studies/Card";
import LoadingScreen from "../../components/inputs/LoadingScreen";
import { domainName } from "../../components/links/AwesomeLink.type";
import SkeletonLayout from "../../components/skeleton-layout/SkeletonLayout";
import { studiesCollection } from "../../firebase";
import styles from "../../styles/case-studies/Container.module.css";

export default function Studies() {
  const [studies, setStudies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(studiesCollection, orderBy("createAt", "asc"));
    getDocs(q).then((snaps) => {
      snaps.forEach((snap) => {
        setStudies((prevStudies) => {
          let study = { id: snap.id, ...snap.data() };
          if (prevStudies.find((s) => s.id === study.id)) return prevStudies;
          return [...prevStudies, study];
        });
      });
    });

    setLoading(false);
  }, []);

  return (
    <SkeletonLayout title="Etudes de cas">
      <div className={styles.list}>
        {loading ? (
          <LoadingScreen />
        ) : (
          studies.map((study, index) => {
            return (
              <Card
                index={index + 1}
                name={study.name}
                imageUrl={study.screenShoot}
                summary={study.quickSummary}
                id={study.id}
              />
            );
          })
        )}
      </div>
    </SkeletonLayout>
  );
}
