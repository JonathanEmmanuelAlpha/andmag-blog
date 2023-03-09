import { addDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { v4 } from "uuid";
import Uploader from "../../components/images-manipulation/Uploader";
import Form from "../../components/inputs/Form";
import Input from "../../components/inputs/Input";
import SubmitButton from "../../components/inputs/SubmitButton";
import Textarea from "../../components/inputs/Textarea";
import SkeletonLayout from "../../components/skeleton-layout/SkeletonLayout";
import { useAuth } from "../../context/AuthProvider";
import { fileUpload, studiesCollection } from "../../firebase";
import useStudy from "../../hooks/useStudy";

const SimpleTextEditor = dynamic(
  () => import("../../components/text editor/SimpleTextEditor"),
  { ssr: false }
);

export default function Add() {
  const router = useRouter();
  const { currentUser } = useAuth();

  const { study, loading: __loading } = useStudy(router.query.channel);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [context, setContext] = useState("");
  const [period, setPeriod] = useState("");
  const [quickSummary, setQuickSummary] = useState("");
  const [summary, setSummary] = useState("");
  const [siteLink, setSiteLink] = useState("");

  const [editor, setEditor] = useState(null);
  const [mainScreenShoot, setMainScreenShoot] = useState();

  useEffect(() => {
    if (__loading || !study) return;

    setName(study.name);
    setRole(study.role);
    setContext(study.context);
    setPeriod(study.period);
    setQuickSummary(study.quickSummary);
    setSummary(study.summary);
    setSiteLink(study.siteUrl);
  }, [__loading, study]);

  const [loading, setLoading] = useState(false);

  function handleSubmit() {
    setLoading(true);

    toast.promise(
      async () => {
        const downloadUrl = await fileUpload(
          `caseStudies/${v4()}`,
          mainScreenShoot,
          null,
          null
        );

        const data = {
          name,
          role,
          context,
          period,
          quickSummary,
          summary,
          siteUrl: siteLink,
          screenShoot: downloadUrl,
          workDescription: JSON.stringify(editor.getContents()),
          createAt: serverTimestamp(),
        };

        await addDoc(studiesCollection, data);
      },
      {
        pending: "Sauvegarde en cours...",
        success: `${name} a été ajouté`,
        error: `Echec de l'ajout`,
      }
    );

    setLoading(false);
  }

  function update() {
    if (!study) return;

    setLoading(true);

    toast.promise(
      async () => {
        let downloadUrl = null;

        if (mainScreenShoot instanceof Blob) {
          downloadUrl = await fileUpload(
            `caseStudies/${study.fileRef}`,
            mainScreenShoot,
            null,
            null
          );
        }

        let data = {};

        if (name !== study.name) data = { ...data, name };
        if (role !== study.role) data = { ...data, role };
        if (context !== study.context) data = { ...data, context };
        if (period !== study.period) data = { ...data, period };
        if (quickSummary !== study.quickSummary)
          data = { ...data, quickSummary };
        if (summary !== study.summary) data = { ...data, summary };
        if (siteLink !== study.siteUrl) data = { ...data, siteLink };

        const desc = JSON.stringify(editor.getContents());

        if (desc !== study.workDescription)
          data = { ...data, workDescription: desc };
        if (downloadUrl) data = { ...data, screenShoot: downloadUrl };

        await updateDoc(doc(studiesCollection, study.id), { ...data });
      },
      {
        pending: "Mise à jour en cours...",
        success: `${name} a été mis à jour`,
        error: `Echec de la mise à jour.`,
      }
    );
  }

  return (
    <SkeletonLayout title="Add a case study">
      <br />
      <br />
      <Form
        title="Add a case study"
        onSubmit={(event) => {
          event.preventDefault();
          if (study) return update();
          return handleSubmit();
        }}
      >
        <Input
          label="Study name"
          id="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxChar={55}
        />
        <Input
          label="Role"
          id="role"
          required
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
        <Input
          label="Context"
          id="context"
          required
          value={context}
          onChange={(e) => setContext(e.target.value)}
        />
        <Input
          label="Period"
          id="period"
          required
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
        />
        <Input
          label="Quick summary"
          id="quick-summary"
          required
          value={quickSummary}
          onChange={(e) => setQuickSummary(e.target.value)}
        />
        <Textarea
          id="summary"
          maxChar={512}
          label="Summary"
          required
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />
        <Input
          label="Site link"
          id="site-link"
          type="url"
          required
          value={siteLink}
          onChange={(e) => setSiteLink(e.target.value)}
        />
        <SimpleTextEditor
          onReady={(quill) => setEditor(quill)}
          initialDelta={study ? JSON.parse(study.workDescription) : null}
        />
        <Uploader
          label="main-screen-shoot"
          message="Add main screen shoot"
          onFilesUpload={(files) => setMainScreenShoot(files[0])}
          openUploader
        />
        <SubmitButton loading={loading} progress={25} text="Save" />
      </Form>
    </SkeletonLayout>
  );
}
