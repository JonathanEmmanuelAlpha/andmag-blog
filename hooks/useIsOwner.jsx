import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { doc, getDoc } from "firebase/firestore";

export default function useIsOwner(currentUser, collection, id) {
  const router = useRouter();
  const [isOwner, setIsOwner] = useState(false);

  const getOwner = async function () {
    try {
      const owner = await getDoc(doc(collection, id));
      return owner.exists() && owner.data().createBy === currentUser.uid;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    if (!currentUser || !collection || !id) return;

    getOwner()
      .then((res) => setIsOwner(res))
      .catch(() => setIsOwner(false));
  }, [currentUser, collection, id]);

  return isOwner;
}
