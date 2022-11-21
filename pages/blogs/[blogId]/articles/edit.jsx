import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

const TextEditor = dynamic(
  import("../../../../components/text editor/TextEditor"),
  { ssr: false }
);

function Edit(props) {
  const router = useRouter();

  return (
    <TextEditor channel={router.query.channel} blogId={router.query.blogId} />
  );
}

export default Edit;
