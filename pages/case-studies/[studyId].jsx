import { useRouter } from "next/router";
import Container from "../../components/case-studies/Container";
import LoadingScreen from "../../components/inputs/LoadingScreen";
import { domainName } from "../../components/links/AwesomeLink.type";
import SkeletonLayout from "../../components/skeleton-layout/SkeletonLayout";
import useStudy from "../../hooks/useStudy";
import styles from "../../styles/case-studies/Container.module.css";

export default function StudyId() {
  const router = useRouter();

  const { loading, study } = useStudy(router.query.studyId);

  return (
    <SkeletonLayout title={loading || !study ? "Chargement..." : study.name}>
      {loading || !study ? (
        <>
          <br />
          <br />
          <LoadingScreen />
        </>
      ) : (
        <Container caseStudy={study} />
      )}
    </SkeletonLayout>
  );
}
