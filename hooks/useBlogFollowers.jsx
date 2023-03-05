import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { profilesCollection } from "../firebase";

export default function useBlogFollowers(blogId) {
  const [followers, setFollowers] = useState(0);

  useEffect(() => {
    if (!blogId) return;

    const followQuery = query(
      profilesCollection,
      where("followed", "array-contains", blogId)
    );
    getDocs(followQuery).then((snaps) => {
      setFollowers((prev) => {
        if (snaps.empty) return 0;
        return snaps.size;
      });
    });
  }, [blogId]);

  return followers;
}
