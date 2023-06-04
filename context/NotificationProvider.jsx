import dashify from "dashify";
import {
  addDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { NotificationToast } from "../components/app-icon/AppICon";
import { domainName } from "../components/links/AwesomeLink.type";
import {
  articlesCollection,
  blogsCollection,
  notificationsCollection,
  trainningsCollection,
} from "../firebase";
import { useAuth } from "./AuthProvider";

const NotificationContext = React.createContext();

export function useNotification() {
  return useContext(NotificationContext);
}

export default function NotificationProvider({ children }) {
  const { userProfile } = useAuth();

  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  /** Listen for new post or test from subscriptions */
  useEffect(() => {
    if (
      !userProfile ||
      !userProfile.followed ||
      userProfile.followed.length === 0
    )
      return;

    const q = query(blogsCollection, where("mostRecentArticle", "!=", null));
    const unsubcriber = onSnapshot(q, (snaps) => {
      snaps.docChanges().forEach((change) => {
        if (change.type === "modified") {
          let blog = { id: change.doc.id, ...change.doc.data() };

          /** Find if we have a new article */
          if (
            blog.mostRecentArticle &&
            !notifications.find((n) => n.targetId === blog.mostRecentArticle)
          ) {
            /** Find the correspondant article */
            getDoc(doc(articlesCollection, blog.mostRecentArticle)).then(
              (article) => {
                /** Create and save new notification document */
                const notif = {
                  targetId: article.id,
                  title: article.data().title,
                  thumbnail: article.data().thumbnail,
                  logo: blog.logo,
                  blog: blog.name,
                  createAt: serverTimestamp(),
                  read: false,
                };

                addDoc(notificationsCollection, notif).then((result) => {
                  // Send a toast to user
                  toast.info(
                    <NotificationToast
                      logo={notif.logo}
                      title={notif.title}
                      url={`${domainName}/articles/${dashify(notif.title)}-${
                        notif.targetId
                      }`}
                      at={notif.createAt || { seconds: new Date().getTime() }}
                      blog={notif.blog}
                      thumbnail={article.data().thumbnail}
                    />,
                    {
                      icon: false,
                    }
                  );
                });
              }
            );
          }
        }
      });
    });

    return unsubcriber;
  }, [userProfile?.followed]);

  /** Count non readed notifications from server */
  useEffect(() => {
    if (!userProfile || !userProfile.id) return;
    setLoading(true);

    const q = query(notificationsCollection, where("read", "==", false));

    setNotifications([]);
    getDocs(q).then((snaps) => {
      snaps.forEach((snap) => {
        setNotifications((prev) => {
          if (prev.find((n) => n.id === snap.id)) return prev;
          return [{ id: snap.id, ...snap.data() }, ...prev];
        });
      });
    });

    setLoading(false);
  }, [userProfile]);

  async function onRead() {
    if (notifications.length === 0) return;

    try {
      notifications.forEach(async (not) => {
        await updateDoc(doc(notificationsCollection, not.id), { read: true });
      });
    } catch (error) {}
  }

  function onClose() {
    return setNotifications([]);
  }

  const value = {
    loading,
    notifications,
    onRead,
    onClose,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
