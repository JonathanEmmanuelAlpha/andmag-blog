import React, { useEffect, useRef } from "react";
import Head from "next/head";
import Image from "next/image";
import Header from "../components/header/Header";
import AwesomeLink from "../components/links/AwesomeLink";
import styles from "../styles/Home.module.css";
import {
  faArrowRight,
  faCloud,
  faCode,
  faCodeBranch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SkeletonLayout from "../components/skeleton-layout/SkeletonLayout";

function SocialsWrapper() {
  return (
    <div className={styles.social_wrapper}>
      <a href="mailto:andmagground@gmail.com">
        <img src="/icons/mail.png" alt="email.png" />
      </a>
      <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer">
        <img src="/icons/whatsapp.png" alt="whatsapp.png" />
      </a>
      <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
        <img src="/icons/facebook.png" alt="facebook.png" />
      </a>
      <a href="https://twiter.com" target="_blank" rel="noopener noreferrer">
        <img src="/icons/twiter.png" alt="twiter.png" />
      </a>
      <div />
    </div>
  );
}

function HeadSection() {
  return (
    <section className={styles.hm}>
      <div className={styles.wrapper}>
        <div className={styles.logo}>
          <h2>Andmag Ground</h2>
          <p>Full stack developer & Google cloud expert.</p>
        </div>
      </div>
    </section>
  );
}

function AboutCard({
  url,
  alt,
  target,
  title,
  description,
  technologies,
  faqUrl,
}) {
  return (
    <div className={styles.card}>
      <div className={styles.card_wrap}>
        <div className={styles.img}>
          <img src={url} alt={alt} />
        </div>
        <div className={styles.details}>
          <span>{target}</span>
          <h3>{title}</h3>
          <p>{description}</p>
          <div className={styles.techs}>
            {technologies.map((tech, index) => (
              <span key={index}>{tech}</span>
            ))}
          </div>
          <div className={`${styles.link} ${styles.oth}`}>
            <AwesomeLink
              text="See FAQ for more"
              url={`/faq#${faqUrl}`}
              icon={faArrowRight}
              direction="horizontal"
              reverse
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function AboutGroup({ index, title, attrs, description, target, id }) {
  return (
    <div className={styles.infos} id={id}>
      <div className={styles.text} data-mask={true}>
        <span>0{index}</span> <div className="mask" />
      </div>
      <div className={styles.msg}>
        <div data-mask={true}>
          <h2>{title}</h2>
          <div className="mask" />
        </div>
        <div data-mask={true}>
          <h3>{attrs[0]}</h3>
          <div className="circle" />
          <h3>{attrs[1]}</h3>
          <div className="mask" />
        </div>
        <div data-mask={true}>
          <p>{description}</p>
          <div className="mask" />
        </div>
      </div>
      <div className={styles.text} data-mask={true}>
        <span>{target}</span> <div className="mask" />
      </div>
    </div>
  );
}

function About() {
  const firstMask = useRef();
  const secondMask = useRef();
  const thirdMask = useRef();
  const fourthMask = useRef();

  /**
   * @param {HTMLDivElement} target
   * @param {Number} offset
   * @returns {Boolean}
   */
  function isVisble(target, offset = 150) {
    const ab =
      target.getBoundingClientRect().height -
      Math.abs(target.getBoundingClientRect().top);
    return target.getBoundingClientRect().top <= offset && ab >= offset;
  }

  /**
   * @param {String} targetId
   */
  function handleVisble(targetId) {
    const masks = document
      .getElementById(targetId)
      .querySelectorAll("[data-mask]");
    masks.forEach((mask) => {
      mask.dataset.mask = false;
    });
  }

  /**
   * @param {String} targetId
   */
  function handleMask(targetId) {
    const masks = document
      .getElementById(targetId)
      .querySelectorAll("[data-mask]");
    masks.forEach((mask) => {
      mask.dataset.mask = true;
    });
  }

  function handleScroll() {
    if (
      firstMask.current == null ||
      secondMask.current == null ||
      thirdMask.current == null
    )
      return;

    if (isVisble(firstMask.current)) {
      handleVisble("first-tg");
    } else {
      handleMask("first-tg");
    }

    if (isVisble(secondMask.current)) {
      handleVisble("secd-tg");
    } else {
      handleMask("secd-tg");
    }

    if (isVisble(thirdMask.current)) {
      handleVisble("third-tg");
    } else {
      handleMask("third-tg");
    }

    if (isVisble(fourthMask.current)) {
      handleVisble("fourth-tg");
    } else {
      handleMask("fourth-tg");
    }
  }

  useEffect(() => {
    if (
      firstMask.current == null ||
      secondMask.current == null ||
      thirdMask.current == null ||
      fourthMask.current == null
    )
      return;

    window.addEventListener("scroll", handleScroll);

    return () => {
      if (
        firstMask.current == null ||
        secondMask.current == null ||
        thirdMask.current == null ||
        fourthMask.current == null
      )
        return;

      window.removeEventListener("scroll", handleScroll);
    };
  }, [firstMask, secondMask, thirdMask, fourthMask]);

  return (
    <section className={styles.about}>
      <div className={styles.tg}>
        <AboutGroup
          index={1}
          title="Mobile Apps & Windows desktops"
          attrs={["Full Stack Developer", "UI Designer"]}
          description="Native applications are today present in every aspects of human life. The request about creating modern, fast, power full and secure native apps is increasingly growing. Andmag offer to you 03 solutions for more than 99.99% of existing platforms."
          target="Natives Apps"
          id="first-tg"
        />
        <AboutGroup
          index={2}
          title="Web Apps & Progressive Web Apps"
          attrs={["Frontend Developer", "Backend Developer"]}
          description="Native applications are today present in every aspects of human life. The request about creating modern, fast, power full and secure native apps is increasingly growing. Andmag offer to you 03 solutions for more than 99.99% of existing platforms."
          target="Web Apps & PWA"
          id="secd-tg"
        />
        <AboutGroup
          index={3}
          title="Google cloud platforms"
          attrs={["Google Analytics", "Google Cloud Developer"]}
          description="Native applications are today present in every aspects of human life. The request about creating modern, fast, power full and secure native apps is increasingly growing. Andmag offer to you 03 solutions for more than 99.99% of existing platforms."
          target="Google Cloud"
          id="third-tg"
        />
        <AboutGroup
          index={4}
          title="Backend Development"
          attrs={["API development", "Databases managment"]}
          description="Native applications are today present in every aspects of human life. The request about creating modern, fast, power full and secure native apps is increasingly growing. Andmag offer to you 03 solutions for more than 99.99% of existing platforms."
          target="Backend"
          id="fourth-tg"
        />
      </div>
      <div className={styles.wrap_content}>
        <div className={styles.wrap} ref={firstMask}>
          <AboutCard
            url="/images/about/ios.png"
            alt="ios.png"
            target="iOS App"
            title="iOS App Development"
            description=""
            technologies={["Objective C", "Swift"]}
            faqUrl="ios-dev"
          />
          <AboutCard
            url="/images/about/android.jpg"
            alt="android.jpg"
            target="Android App"
            title="Android App Development"
            description=""
            technologies={["Kotlin", "Java", "XML"]}
            faqUrl="android-dev"
          />
          <AboutCard
            url="/images/about/uwp.png"
            alt="uwp.png"
            target="UWP App"
            title="Universal Windows Platforms"
            description=""
            technologies={["CSharp", ".NET", "Azure", "Windows forms"]}
            faqUrl="uwp-dev"
          />
          <AboutCard
            url="/images/about/cross-platform.jpg"
            alt="cross-platform.jpg"
            target="Cross-platform App"
            title="Cross-platforms development"
            description=""
            technologies={["React Native", "Xamarin"]}
            faqUrl="uwp-dev"
          />
        </div>
        <div className={styles.wrap} ref={secondMask}>
          <AboutCard
            url="/images/about/web.jpg"
            alt="web.jpg"
            target="Web App"
            title="Web App Development"
            description=""
            technologies={["HTML 5", "CSS 3", "JavaScript", "PHP", "Python"]}
            faqUrl="web-dev"
          />
          <AboutCard
            url="/images/about/pwa.png"
            alt="pwa.png"
            target="PW App"
            title="Progressive Web app"
            description=""
            technologies={["HTML 5", "CSS 3", "JavaScript"]}
            faqUrl="pwa-dev"
          />
        </div>
        <div className={styles.wrap} ref={thirdMask}>
          <AboutCard
            url="/images/about/analytics.jpeg"
            alt="analytics.jpeg"
            target="Web App"
            title="Web App Development"
            description=""
            technologies={["HTML 5", "CSS 3", "JavaScript", "PHP", "Python"]}
            faqUrl="web-dev"
          />
          <AboutCard
            url="/images/about/ads.png"
            alt="ads.png"
            target="PW App"
            title="Progressive Web app"
            description=""
            technologies={["HTML 5", "CSS 3", "JavaScript"]}
            faqUrl="pwa-dev"
          />
          <AboutCard
            url="/images/about/cloud.png"
            alt="cloud.png"
            target="PW App"
            title="Progressive Web app"
            description=""
            technologies={["HTML 5", "CSS 3", "JavaScript"]}
            faqUrl="pwa-dev"
          />
        </div>
        <div className={styles.wrap} ref={fourthMask}>
          <AboutCard
            url="/images/about/rest.png"
            alt="rest.png"
            target="Rest api"
            title="Rest & RestFull API"
            description=""
            technologies={["HTML 5", "CSS 3", "JavaScript", "PHP", "Python"]}
            faqUrl="rest-api"
          />
          <AboutCard
            url="/images/about/graphql.png"
            alt="graphql.png"
            target="GraphQL"
            title="GraphQL API"
            description=""
            technologies={["HTML 5", "CSS 3", "JavaScript"]}
            faqUrl="graphql-api"
          />
          <AboutCard
            url="/images/about/sql.jpg"
            alt="sql.jpg"
            target="SQL"
            title="SQL base Databases"
            description=""
            technologies={["HTML 5", "CSS 3", "JavaScript"]}
            faqUrl="sql"
          />
          <AboutCard
            url="/images/about/nosql.jpg"
            alt="nosql.jpg"
            target="NoSQL"
            title="NoSQL base Databases"
            description=""
            technologies={["HTML 5", "CSS 3", "JavaScript"]}
            faqUrl="no-sql"
          />
        </div>
      </div>
    </section>
  );
}

function SkillList() {
  return (
    <section className={styles.skill_list}>
      <div className={styles.skill}>
        <FontAwesomeIcon icon={faCode} />
        <h2>Frontend</h2>
        <div className={styles.skill_group}>
          <p>
            I've learn and mastering a many languages for UI/UX integration. I
            like code things from scratch and brings ideas to life in browsers,
            windows and on mobile devices
          </p>
          <ul>
            <li>HTML 5</li>
            <li>CSS 3</li>
            <li>JavaScript</li>
            <li>TypeScript</li>
            <li>XML</li>
            <li>XAML</li>
          </ul>
        </div>
        <div className={styles.skill_group}>
          <p>Libraries and Frameworks for the frontend development</p>
          <ul>
            <li>ReactJS</li>
            <li>React Native</li>
            <li>NextJS</li>
            <li>VueJS</li>
            <li>SASS</li>
            <li>Xamrin Forms</li>
            <li>Windows Forms</li>
          </ul>
        </div>
        <div className={styles.link}>
          <AwesomeLink
            text="Ask a quote"
            url="/ask-a-quote?appType=CLIENT"
            icon={faArrowRight}
            direction="horizontal"
            reverse
          />
        </div>
      </div>
      <div className={styles.skill}>
        <FontAwesomeIcon icon={faCodeBranch} />
        <h2>Backend</h2>
        <div className={styles.skill_group}>
          <p>
            Mastering backend architecture is a dream that comes true. I love
            create modern, fast and secure backend architectures that meets
            every projects i work with. You have a project and need API, let's
            do it.
          </p>
          <ul>
            <li>JavaScript</li>
            <li>TypeScript</li>
            <li>PHP</li>
            <li>Python</li>
            <li>CSharp (C#)</li>
          </ul>
        </div>
        <div className={styles.skill_group}>
          <p>Frameworks, tools, and API for the backend development</p>
          <ul>
            <li>NodeJS</li>
            <li>ExpressJS</li>
            <li>Symfony</li>
            <li>Django</li>
            <li>.NET Core</li>
            <li>REST API</li>
            <li>GraphQL API</li>
          </ul>
        </div>
        <div className={styles.link}>
          <AwesomeLink
            text="Ask a quote for API"
            url="/ask-a-quote?appType=API"
            icon={faArrowRight}
            direction="horizontal"
            reverse
          />
        </div>
      </div>
      <div className={styles.skill}>
        <FontAwesomeIcon icon={faCloud} />
        <h2>Google cloud & AI</h2>
        <div className={styles.skill_group}>
          <p>Google Analytics</p>
          <ul>
            <li>Linear algébra</li>
            <li>Python</li>
          </ul>
        </div>
        <div className={styles.skill_group}>
          <p>Libraries use in machine learning algorithms</p>
          <ul>
            <li>Numpy</li>
            <li>Matplotlib</li>
            <li>Pandas</li>
            <li>Scikit Learn</li>
            <li>SciPY</li>
            <li>OpenCV</li>
            <li>Keras</li>
            <li>Tensorflow</li>
          </ul>
        </div>
        <div className={styles.link}>
          <AwesomeLink
            text="Ask a quote"
            url="/ask-a-quote?appType=GOOGLE_CLOUD"
            icon={faArrowRight}
            direction="horizontal"
            reverse
          />
        </div>
      </div>
    </section>
  );
}

function InfoCard({
  imageUrl,
  title,
  description,
  linkUrl,
  linkText,
  children,
}) {
  return (
    <section className={styles.info_card}>
      <div className={styles.left}>
        <img src={imageUrl} alt={title + ".png"} />
        <div className={styles.over} />
      </div>
      <div className={styles.right}>
        <h2>{title}</h2>
        <p>{description}</p>
        {children}
        <div className={`${styles.link} ${styles.oth}`}>
          <AwesomeLink
            text={linkText}
            url={linkUrl}
            icon={faArrowRight}
            direction="horizontal"
            reverse
          />
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <InfoCard
      imageUrl={"/images/contact-us.webp"}
      title={"Get in touch"}
      description={
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vehicula at velit ut efficitur. Nulla imperdiet ultrices diam ut facilisis. Sed mattis nibh vitae odio hendrerit, maximus facilisis quam iaculis. Suspendisse sit amet orci imperdiet nulla pellentesque mattis. Cras pharetra urna ac efficitur egestas. "
      }
      linkText={"Send me an email"}
      linkUrl={"/contact"}
    >
      <div className={styles.social_links}>
        <a href="mailto:andmagground@gmail.com">
          <img src="/icons/mail.png" alt="email.png" />
        </a>
        <a
          href="https://whatsapp.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="/icons/whatsapp.png" alt="whatsapp.png" />
        </a>
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="/icons/facebook.png" alt="facebook.png" />
        </a>
        <a href="https://twiter.com" target="_blank" rel="noopener noreferrer">
          <img src="/icons/twiter.png" alt="twiter.png" />
        </a>
      </div>
    </InfoCard>
  );
}

export default function Home() {
  return (
    <SkeletonLayout>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <HeadSection />
          <About />
          <SkillList />
          <InfoCard
            imageUrl={"/images/contact-us.webp"}
            title={"Pricing"}
            description={
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vehicula at velit ut efficitur. Nulla imperdiet ultrices diam ut facilisis. Sed mattis nibh vitae odio hendrerit, maximus facilisis quam iaculis. Suspendisse sit amet orci imperdiet nulla pellentesque mattis. Cras pharetra urna ac efficitur egestas. "
            }
            linkText={"Price calculation"}
            linkUrl={"/pricing"}
          />
          <InfoCard
            imageUrl={"/images/contact-us.webp"}
            title={"FAQ"}
            description={
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vehicula at velit ut efficitur. Nulla imperdiet ultrices diam ut facilisis. Sed mattis nibh vitae odio hendrerit, maximus facilisis quam iaculis. Suspendisse sit amet orci imperdiet nulla pellentesque mattis. Cras pharetra urna ac efficitur egestas. "
            }
            linkText={"go forward"}
            linkUrl={"/faq"}
          />
          <Contact />
        </div>
        <SocialsWrapper />
      </div>
    </SkeletonLayout>
  );
}
