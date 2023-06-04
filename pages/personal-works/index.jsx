import styles from "../../styles/personal-works/style.module.css";
import SkeletonLayout from "../../components/skeleton-layout/SkeletonLayout";

export default function PersonalWorks() {
  return (
    <SkeletonLayout>
      <ul>
        <li>Andmag projects</li>
        <li>Andmag bug tester</li>
        <li>Andmag Live Room</li>
      </ul>
    </SkeletonLayout>
  );
}
