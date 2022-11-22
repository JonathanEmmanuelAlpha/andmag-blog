import React, { useEffect, useState } from "react";
import Header from "../../../components/header/Header";
import Uploader from "../../../components/images-manipulation/Uploader";
import Alert from "../../../components/inputs/Alert";
import Form from "../../../components/inputs/Form";
import Input from "../../../components/inputs/Input";
import SubmitButton from "../../../components/inputs/SubmitButton";
import Textarea from "../../../components/inputs/Textarea";
import SkeletonLayout, {
  Layout,
} from "../../../components/skeleton-layout/SkeletonLayout";
import { useAuth } from "../../../context/AuthProvider";
import useBlog from "../../../hooks/useBlog";
import useIsAdmin from "../../../hooks/useIsAdmin";
import useIsAurh from "../../../hooks/useIsAurh";

export default function Blog() {
  const { currentUser, loadingUser, userProfile } = useAuth();
  const { adminId, isAdmin } = useIsAdmin(currentUser);
  useIsAurh(currentUser, loadingUser);
  const { create, update, loading, error, blog } = useBlog(userProfile?.blogId);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [banner, setBanner] = useState();
  const [logo, setLogo] = useState();

  useEffect(() => {
    if (!blog) return;

    setName(blog.name);
    setDescription(blog.description);
  }, [blog]);

  return (
    <SkeletonLayout
      title={blog && blog.id ? "Mise à jour du blog" : "Créer un nouveau blog"}
      robots={"noindex,nofollow"}
    >
      <div style={{ padding: "30px 20px" }}>
        <Form
          title={
            blog && blog.id ? "Mise à jour du blog" : "Créer un nouveau blog"
          }
          onSubmit={async (event) => {
            event.preventDefault();
            if (blog && blog.id)
              return await update(
                name,
                description,
                banner,
                logo,
                adminId,
                blog
              );
            return await create(name, description, banner, logo, adminId);
          }}
        >
          {error && <Alert message={error} type="danger" />}
          <Input
            label="Blog name"
            required
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="off"
            maxChar={25}
          />
          <Textarea
            label="Blog description"
            required
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            autoComplete="off"
            rows="5"
            maxChar={255}
          />
          <Uploader
            label="banner"
            message="Add a banner to your blog"
            inforMessage="Click or Drag and drop an image here to add a banner"
            openUploader
            onFilesUpload={(files) => setBanner(files[0])}
          />
          <Uploader
            label="logo"
            message="Add a logo to your blog"
            inforMessage="Click or Drag and drop an image here to add a logo"
            openUploader
            onFilesUpload={(files) => setLogo(files[0])}
          />
          <SubmitButton
            text={blog && blog.id ? "Sauvegarder" : "Créer"}
            loading={loading}
            progress={25}
          />
        </Form>
      </div>
    </SkeletonLayout>
  );
}
