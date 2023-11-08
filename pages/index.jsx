import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Header from "../components/header/Header";
import AwesomeLink from "../components/links/AwesomeLink";
import styles from "../styles/Home.module.css";
import {
  faAngleLeft,
  faAngleRight,
  faArrowRight,
  faCloud,
  faCode,
  faCodeBranch,
  faMessage,
  faNewspaper,
  faPenToSquare,
  faRegistered,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SkeletonLayout from "../components/skeleton-layout/SkeletonLayout";
import {
  EmailIcon,
  FacebookIcon,
  TwiterIcon,
  WhatsappIcon,
} from "../components/app-icon/AppICon";
import Link from "next/link";
import { domainName } from "../components/links/AwesomeLink.type";
import { getDocs, query, setDoc, where } from "firebase/firestore";
import { adminsCollection, handleFirestoreErrors } from "../firebase";
import { useAuth } from "../context/AuthProvider";
import { toast } from "react-toastify";

function SocialsWrapper() {
  return (
    <div className={styles.social_wrapper}>
      <a href="mailto:andmagground@gmail.com">
        <EmailIcon />
      </a>
      <a
        href="https://wa.me/237620689433"
        target="_blank"
        rel="noopener noreferrer"
      >
        <WhatsappIcon />
      </a>
      <a
        href="https://facebook.com/AndmagGround"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FacebookIcon />
      </a>
      <a
        href="https://twiter.com/AndmagGround"
        target="_blank"
        rel="noopener noreferrer"
      >
        <TwiterIcon />
      </a>
      <div />
    </div>
  );
}

function HeadSection() {
  return (
    <section className={styles.hm}>
      <div className={styles.wrapper}>
        <h1>Andmag Ground</h1>
        <p>Full stack developer & UI/UX Designer.</p>
        <div className={styles.mor_links}>
          <Link href={`${domainName}/personal-works`}>
            <a className={styles.cs}>Travaux personnels</a>
          </Link>
          <Link href={`${domainName}/case-studies`}>
            <a className={styles.re}>Réalistations</a>
          </Link>
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
          <Image
            className="skeleton"
            src={url}
            alt={alt}
            priority
            width={350}
            height={200}
          />
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
              text="Plus d'informations"
              url={`/faq/${faqUrl}`}
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
  }

  useEffect(() => {
    if (
      firstMask.current == null ||
      secondMask.current == null ||
      thirdMask.current == null
    )
      return;

    window.addEventListener("scroll", handleScroll);

    return () => {
      if (
        firstMask.current == null ||
        secondMask.current == null ||
        thirdMask.current == null
      )
        return;

      window.removeEventListener("scroll", handleScroll);
    };
  }, [firstMask, secondMask, thirdMask, handleScroll]);

  return (
    <section className={styles.about}>
      <div className={styles.tg}>
        <AboutGroup
          index={1}
          title="Mobile Apps & Windows desktops"
          attrs={["Full Stack Developer", "UI Designer"]}
          description="Les applications natives sont présentes aujourd'hui dans tous les aspects de la vie humaine. La demande de création d’applications natives modernes, rapides et sécurisées est de plus en plus croissante. Andmag vous offre 03 solutions pour plus de 99,99% des plateformes existantes."
          target="Natives Apps"
          id="first-tg"
        />
        <AboutGroup
          index={2}
          title="Web Apps & Progressive Web Apps"
          attrs={["Frontend Developer", "Backend Developer"]}
          description="La création d’une application web vous permet de disposer d’une application qui sera accessible depuis n’importe quel appareil. De plus, contrairement aux applications natives, elles ne nécessitent pas de téléchargement. Profiter en plus de certaines fonctionnalités natives grâce aux PWA."
          target="Web Apps & PWA"
          id="secd-tg"
        />
        <AboutGroup
          index={3}
          title="Backend Development"
          attrs={["API development", "Databases managment"]}
          description="Avec une API, des ordinateurs pouront gérer automatiquement vos tâches plutôt que de les faire manuellement via des personnes. Grâce aux API, les agences peuvent mettre à jour leurs flux de travail pour les rendre plus rapides et plus productifs."
          target="Backend"
          id="third-tg"
        />
      </div>
      <div className={styles.wrap_content}>
        <div className={styles.wrap} ref={firstMask}>
          <AboutCard
            url="/images/about/ios.png"
            alt="ios.png"
            target="iOS App"
            title="iOS App Development"
            description="Des applications hautement performantes et accessible même sur les modèles plus anciens tels que les 6s et 7s. Une expérience utilisateur améliorée vous assurant la confiance de vos utilisateurs."
            technologies={["Objective C", "Swift"]}
            faqUrl="native-app#ios"
          />
          <AboutCard
            url="/images/about/android.jpg"
            alt="android.jpg"
            target="Android App"
            title="Android App Development"
            description="Elargissez vos perspectives en ciblant la plateforme possédant 84% des parts de marché mondiale. Andmag-ground vous offre la possibilité de conquérir ce marché de consommation dès aujourd’hui. N’attendez plus et prenez le taureau par les cornes."
            technologies={["Kotlin", "Java", "XML"]}
            faqUrl="native-app#android"
          />
          <AboutCard
            url="/images/about/uwp.png"
            alt="uwp.png"
            target="UWP App"
            title="Plateformes Windows Universelles"
            description="Ciblez l’ensemble des familles d’appareils (tablettes, PC, XBOX, Windows Phone, etc..) utilisant le système Windows avec une seule application. Ce qui représente pour vous un gain considérable en temps et en coût."
            technologies={[
              "C++",
              "CSharp",
              "VB",
              ".NET",
              "Azure",
              "Windows forms",
              "XAML",
            ]}
            faqUrl="native-app#uwp"
          />
          <AboutCard
            url="/images/about/cross-platform.jpg"
            alt="cross-platform.jpg"
            target="Cross-platform App"
            title="Cross-platforms development"
            description="Vous envisagez de ciblez l’ensemble du marché de consommation mais n’avez pas les moyens de payer pour avoir des copies différentes de la même application pour chaque plateforme ? Envisagez la création d’une seule application multiplateforme à la place."
            technologies={[
              "React Native",
              "Flutter",
              "Ionic",
              "Xamarin",
              "Kotlin Multiplatform Mobile",
            ]}
            faqUrl="native-app#cross-platforms"
          />
        </div>
        <div className={styles.wrap} ref={secondMask}>
          <AboutCard
            url="/images/about/web.jpg"
            alt="web.jpg"
            target="Web App"
            title="Web App Development"
            description="La pluspart des entreprises essaient de créer leur propre domaine Web et leur propre application afin de s'assurer qu'un grand nombre de leurs clients cibles sont attirés en même temps. Ne soyez plus en reste dès aujoud'hui."
            technologies={["HTML 5", "CSS 3", "JavaScript", "PHP", "Python"]}
            faqUrl="web-pwa#web"
          />
          <AboutCard
            url="/images/about/pwa.png"
            alt="pwa.png"
            target="PW App | Hybrid App"
            title="Applications hybrides"
            description="Si vous cherchez le meilleur parti entre application native et application web, les applications hybrides sont faites pour vous. Elles sont actuellement le leader sur le marché et présentent de nombreux avantages par rapport aux deux autres."
            technologies={["HTML 5", "CSS 3", "JavaScript"]}
            faqUrl="web-pwa#pwa"
          />
        </div>
        <div className={styles.wrap} ref={thirdMask}>
          <AboutCard
            url="/images/about/rest.png"
            alt="rest.png"
            target="Rest api"
            title="Rest & RestFull API"
            description="Concevez une API simple, rapide et sécurisée en quelques étapes et à moindre coût. Idéale pour des projets moyennes envergures ciblant des tâches spécifiques à la demande."
            technologies={[
              "PHP 8",
              "JavaScript",
              "TypeScript",
              "Python",
              ".Net Core & C#",
            ]}
            faqUrl="api#rest"
          />
          <AboutCard
            url="/images/about/graphql.png"
            alt="graphql.png"
            target="GraphQL"
            title="GraphQL API"
            description="Si vous souhaitez plutôt une API traitant des schémas de données conséquent et multiples, l'API développée et utilisée par Facebook est ce qu'il vous faut. Notez toute fois qu'il faudra mettre la main à la poche."
            technologies={[
              "PHP 8",
              "JavaScript",
              "TypeScript",
              "Python",
              ".Net Core & C#",
            ]}
            faqUrl="api#graphql"
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
            {
              "J'ai appris et maîtrisé plusieurs langages pour des intégrations UI/UX. J'aime coder à partir de zéro et donnez vie à toutes sortes d'idées peu importe leurs complexités de réalisation."
            }
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
          <p>Bibliothèques utilisées pour le developpement frontend.</p>
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
            text="En s'avoir plus"
            url="/faq#frontend"
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
            {
              "Construire une API est une expérience enrichissante et plein d'entrain. J'aime créer des API performantes et sécurisées qui s'adaptent à tout type de projet sur lesquels je travaillent."
            }
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
            text="Plus d'informations"
            url="/faq#backend"
            icon={faArrowRight}
            direction="horizontal"
            reverse
          />
        </div>
      </div>
      <div className={styles.skill}>
        <FontAwesomeIcon icon={faCloud} />
        <h2>Prestataires</h2>
        <div className={styles.skill_group}>
          <p>
            Pour la gestion de vos données, vous préféreriez peut-être ne pas
            avoir à débourser pour la construction d’une API. Je vous offre la
            possibilité le cas échéant, les alternatives suivantes.
          </p>
          <ul>
            <li>Google Cloud</li>
            <li>Amazon</li>
            <li>Azure</li>
            <li>Oracle Cloud</li>
          </ul>
        </div>
        <div className={styles.skill_group}>
          <p>{"Autres prestataires de services que j'utilise très souvent."}</p>
          <ul>
            <li>Firebase</li>
            <li>Google Ads</li>
            <li>Google Analytics</li>
            <li>AWS</li>
            <li>Paypal</li>
            <li>Stripe</li>
          </ul>
        </div>
        <div className={styles.link}>
          <AwesomeLink
            text="Plus d'informations"
            url="/faq#backend"
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
        <img className="skeleton" src={imageUrl} alt={title + ".png"} />
        <div className={styles.over} />
      </div>
      <div className={styles.right}>
        <h2 className="thin-text-3d">{title}</h2>
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
      title={"Entrer en contact"}
      description={
        "Pour me contacter, plusieurs moyens sont mis à votre disposition. Vous pouvez visitez l'une de mes pages sur les réseaux sociaux et plateformes de messageries ci-dessous. Vous pouvez, si vous le souhaité, cliquer sur le lien en bas à droite pour m'envoyer un email."
      }
      linkText={"Envoyer un email"}
      linkUrl={"/contact"}
    >
      <div className={styles.social_links}>
        <a href="mailto:andmagground@gmail.com">
          <EmailIcon />
        </a>
        <a
          href="https://wa.me/237620689433"
          target="_blank"
          rel="noopener noreferrer"
        >
          <WhatsappIcon />
        </a>
        <a
          href="https://www.facebook.com/AndmagGround"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FacebookIcon />
        </a>
        <a
          href="https://twiter.com/AndmagGround"
          target="_blank"
          rel="noopener noreferrer"
        >
          <TwiterIcon />
        </a>
      </div>
    </InfoCard>
  );
}

function CTCItem({ icon, message, rank }) {
  return (
    <div>
      <div className={styles.ctc_item} data-target-slide data-color={rank}>
        <div>
          <FontAwesomeIcon icon={icon} />
        </div>
        <p>{message}</p>
      </div>
    </div>
  );
}

function ContentCreator() {
  const { currentUser } = useAuth();

  const step = 370;
  const [translate, setTranslate] = useState(0);
  const [loading, setLoading] = useState(true);

  function slideLeft() {
    const slides = document.querySelectorAll("[data-target-slide]");
    slides.forEach((slide) => {
      const currentTranslate = parseInt(
        getComputedStyle(slide).getPropertyValue("--translate")
      );
      console.log("Current: ", currentTranslate + step);

      setTranslate(currentTranslate + step);

      slide.style.setProperty("--translate", currentTranslate + step);
    });
  }

  function slideRight() {
    const slides = document.querySelectorAll("[data-target-slide]");
    slides.forEach((slide) => {
      const currentTranslate = parseInt(
        getComputedStyle(slide).getPropertyValue("--translate")
      );
      console.log("Current: ", currentTranslate - step);

      setTranslate(currentTranslate - step);

      slide.style.setProperty("--translate", currentTranslate - step);
    });
  }

  async function canPostulate() {
    const q = query(adminsCollection, where("userId", "==", currentUser.uid));
    const exist = await getDocs(q).then((snaps) => {
      if (!snaps.empty)
        throw new Error("Vous êtes déjà l'un des blogeur de la plateforme !");
    });
  }

  async function addBlogger() {
    await canPostulate();
    await setDoc(doc(adminsCollection, currentUser.uid), {
      userId: currentUser.uid,
      email: currentUser.email,
    });
  }

  async function handleClick(e) {
    e.preventDefault();
    if (!currentUser) return;

    setLoading(true);
    toast.promise(addBlogger(), {
      pending: "Opération en cours...",
      success: "Félécitation. Vous pouvez désormais créer un blog.",
      error: {
        render({ data }) {
          if (typeof data.message === "string") return data.message;
          return handleFirestoreErrors(data.error);
        },
      },
    });
  }

  return (
    <div className={styles.content_creator}>
      <div className={styles.ctc_infos}>
        <h2>Laissez parler votre créativité en devenant créateur de contenu</h2>
        <p>
          Andmag ground vous offre la possibilité de créer un blog en quelque
          clicks.
        </p>
        <div className={styles.ctc_btns}>
          <div className={styles.ctc_nav}>
            <button onClick={slideLeft} disabled={translate == 0}>
              <FontAwesomeIcon icon={faAngleLeft} />
            </button>
            <button onClick={slideRight} disabled={translate <= -3 * step}>
              <FontAwesomeIcon icon={faAngleRight} />
            </button>
          </div>
          <Link href={"/content-creator/recruit"}>
            <a aria-disabled={loading} onClick={handleClick}>
              <span>Postuler</span>
              <FontAwesomeIcon icon={faArrowRight} />
            </a>
          </Link>
        </div>
      </div>
      <div className={styles.ctc_wrapper}>
        <CTCItem
          icon={faPenToSquare}
          message={"Devennez blogeur en 02 petites étapes simples et rapides."}
          rank={1}
        />
        <CTCItem
          icon={faNewspaper}
          message={
            "Créer du contenu au gré de votre humeur (articles de blog, publication, système de test)"
          }
          rank={2}
        />
        <CTCItem
          icon={faSearch}
          message={
            "Soiyez en tête des résultats de recherches google sans débourser les moindre sous."
          }
          rank={3}
        />
        <CTCItem
          icon={faRegistered}
          message={
            "Tout ce que vous avez à faire est de cliquer sur le lien à votre gauche."
          }
          rank={4}
        />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <SkeletonLayout isHome={true}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <HeadSection />
          <About />
          <SkillList />
          <ContentCreator />
          <InfoCard
            imageUrl={"/images/faq.WEBP"}
            title={"FAQ"}
            description={
              "Vous avez des préoccupations immédiates ? La FAQ est faite pour vous. Vous y trouverez un concentré des préoccupations les plus courantes de nos clients et membre de la communauté. N'hésitez pas à vous y rendre et si vous ne trouvez pas ce que vous cherchez, vous pouvez toujours me contacter."
            }
            linkText={"Aller de l'avant"}
            linkUrl={"/faq"}
          />
          <Contact />
        </div>
        <SocialsWrapper />
      </div>
    </SkeletonLayout>
  );
}
