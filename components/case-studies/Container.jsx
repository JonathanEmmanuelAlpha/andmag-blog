import dynamic from "next/dynamic";
import React from "react";
import styles from "../../styles/case-studies/Container.module.css";
import { ExternalLink } from "./Card";

const QuillContent = dynamic(() => import("../article/QuillContent"), {
  ssr: false,
});

function Header({ name, quickSummary, screenShoot, role, context, period }) {
  return (
    <header
      className={styles.header}
      style={{ backgroundImage: `url("${screenShoot}")` }}
    >
      <h1>{name}</h1>
      <p>
        <i>{quickSummary}</i>
      </p>
      <div className={styles.infos}>
        <div>
          <div>
            <strong>Role</strong>
            {role}
          </div>
          <div>
            <strong>Contexte</strong>
            {context}
          </div>
          <div>
            <strong>Période</strong>
            {period}
          </div>
        </div>
      </div>
      <div className={styles.overlay} />
    </header>
  );
}

function Summary({ summary, siteUrl }) {
  return (
    <section className={styles.summary}>
      <h2>Introduction</h2>
      <p>{summary}</p>
      <ExternalLink url={siteUrl} />
    </section>
  );
}

export default function Container({ caseStudy }) {
  return (
    <div className={styles.container}>
      <Header
        name={caseStudy.name}
        quickSummary={caseStudy.quickSummary}
        screenShoot={caseStudy.screenShoot}
        context={caseStudy.context}
        period={caseStudy.period}
        role={caseStudy.role}
      />
      <Summary summary={caseStudy.summary} siteUrl={caseStudy.siteUrl} />
      <div className={styles.work_desc}>
        <QuillContent delta={JSON.parse(caseStudy.workDescription)} />
      </div>
    </div>
  );
}
