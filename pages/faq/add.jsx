import { faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import styles from "../../styles/faq/base.module.css";
import SkeletonLayout from "../../components/skeleton-layout/SkeletonLayout";
import FaqMenu from "../../components/faq/FaqMenu";
import Form from "../../components/inputs/Form";
import Input from "../../components/inputs/Input";
import { useRouter } from "next/router";
import Select from "../../components/inputs/Select";
import SubmitButton from "../../components/inputs/SubmitButton";
import Alert from "../../components/inputs/Alert";
import dynamic from "next/dynamic";
import { addDoc, serverTimestamp } from "firebase/firestore";
import { faqsCollection, handleFirestoreErrors } from "../../firebase";
import dashify from "dashify";

const SimpleTextEditor = dynamic(
  () => import("../../components/text editor/SimpleTextEditor"),
  {
    ssr: false,
  }
);

export const CATEGORIES = [
  { type: "Native App", name: "Applications natives" },
  { type: "Web PWA", name: "Applications Web et Hybrides" },
  { type: "API", name: "Cronstruction d'API" },
  { type: "Others", name: "Autres préoccupations" },
];

export default function AddFaq() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [baseRoute, setBaseRoute] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [editor, setEditor] = useState();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (name.length > 32)
      return setError(
        "L'intitulé ne doit pas contenir plus de 32 charactères."
      );
    if (name.length < 10)
      return setError("L'intitulé doit contenir plus de 10 charactères.");
    if (!CATEGORIES.find((cat) => cat.type === category))
      return setError("Veuillez selectioner une catégorie valide.");

    setLoading(true);
    const data = {
      name,
      category,
      route: baseRoute,
      content: JSON.stringify(editor.getContents()),
      createAt: serverTimestamp(),
    };

    try {
      await addDoc(faqsCollection, data);
      return router.push(`/faq/${dashify(category)}#${baseRoute}`);
    } catch (error) {
      return setError(handleFirestoreErrors(error));
    }

    setLoading(false);
  }

  return (
    <SkeletonLayout
      title="Ajouter un élément à la faq"
      description=""
      robots={"noindex,nothrow"}
    >
      <div className={styles.container}>
        <section className={styles.add_section}>
          <Form title={"Ajouter un élément"} onSubmit={handleSubmit}>
            <div className={styles.flex}>
              <Input
                autoComplete={"on"}
                id="name"
                label="Intitulé de l'élément"
                required
                maxChar={32}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                autoComplete={"on"}
                id="base-route"
                label="Nom de la route"
                required
                maxChar={32}
                value={baseRoute}
                onChange={(e) => setBaseRoute(e.target.value)}
              />
            </div>
            <Select
              label={"Catégorie"}
              id="category"
              list={"category"}
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((categorie, index) => (
                <option key={index} value={categorie.type}>
                  {categorie.name}
                </option>
              ))}
            </Select>
            <SimpleTextEditor onReady={(q) => setEditor(q)} />
            {error && <Alert type="danger" message={error} />}
            <SubmitButton loading={loading} progress={25} text="Enregistrer" />
          </Form>
        </section>
      </div>
      <div className={styles.to_top}>
        <button
          onClick={() => {
            document.body.scrollTo({ top: 0, left: 0, behavior: "smooth" });
          }}
        >
          <FontAwesomeIcon icon={faAngleUp} />
        </button>
      </div>
    </SkeletonLayout>
  );
}
