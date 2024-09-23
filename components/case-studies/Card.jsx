import {
  faArrowRight,
  faExternalLink,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import styles from "../../styles/case-studies/Card.module.css";

function ExploreButton({ id, text }) {
  return (
    <Link href={`/case-studies/${id}`}>
      <a className={styles.exp_btn}>
        Explorer <FontAwesomeIcon icon={faArrowRight} />
      </a>
    </Link>
  );
}

export function ExternalLink({ url }) {
  return (
    <a
      className={styles.exp_btn}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
    >
      Explorer le site <FontAwesomeIcon icon={faExternalLink} />
    </a>
  );
}

export default function Card({ index, name, imageUrl, id, summary }) {
  return (
    <div className={styles.container}>
      <Image
        className="skeleton"
        src={imageUrl}
        alt={name + " - screen shoot"}
        priority
        width={800}
        layout="fill"
      />
      <div className={styles.overlay}>
        <span>{index < 10 ? `0${index}` : index}</span>
      </div>
      <div className={styles.wrapper}>
        <span>{name}</span>
        <p>
          <i>{summary}</i>
        </p>
        <ExploreButton id={id} />
      </div>
    </div>
  );
}
