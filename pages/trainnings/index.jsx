import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import LoadingScreen from "../../components/inputs/LoadingScreen";
import ActivitiesContainer from "../../components/trainning/ActivitiesContainer";
import DomainCard from "../../components/trainning/DomainCard";
import TrainningCard from "../../components/trainning/TrainningCard";
import useBlogSearch from "../../hooks/useBlogSearch";
import useOnScreen from "../../hooks/useOnScreen";
import styles from "../../styles/trainning/ActivitiesContainer.module.css";

export default function Trainnings(props) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  const { docs, error, hasMore, loading } = useBlogSearch(
    searchQuery,
    15,
    pageNumber
  );

  const divRef = useRef();
  useOnScreen("0px", divRef, () => {
    setPageNumber((prev) => prev + 1);
  });

  return (
    <ActivitiesContainer
      pageTitle="Andmag-groun - Trainnings"
      pageDesc=""
      searchHolder="Taper le nom d'un blog pour aller plus vite"
      value={name}
      onchange={(e) => setName(e.target.value)}
      handleSearch={() => {
        setSearchQuery(name);
        setPageNumber(1);
      }}
    >
      {loading ? (
        <LoadingScreen />
      ) : (
        <div className={styles.card_list}>
          {docs.map((blog) => {
            return (
              <DomainCard
                key={blog.id}
                banner={blog.banner}
                description={blog.description.slice(0, 125)}
                domainRoute={`/trainnings/${blog.id}`}
                tests={blog.tests}
                title={blog.name}
              />
            );
          })}
        </div>
      )}
      <div className="ref-div" ref={divRef} />
    </ActivitiesContainer>
  );
}
