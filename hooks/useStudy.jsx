import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { studiesCollection } from "../firebase";

export default function useStudy(channel) {
  const [study, setStudy] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!channel || typeof channel !== "string") return;

    getDoc(doc(studiesCollection, channel)).then((snap) =>
      setStudy({ id: snap.id, ...snap.data() })
    );

    setLoading(false);
  }, [channel]);

  return { loading, study };
}
