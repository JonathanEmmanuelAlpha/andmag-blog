import dashify from "dashify";
import { getDocs, orderBy, query } from "firebase/firestore";
import React, { useContext, useState, useEffect } from "react";
import { faqsCollection } from "../firebase";

const FAQContext = React.createContext();

export function useFAQ() {
  return useContext(FAQContext);
}

export default function FAQProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  /** Get All FAQ Item */
  useEffect(() => {
    setItems([]);

    const q = query(faqsCollection, orderBy("createAt", "asc"));
    getDocs(q).then((results) => {
      results.forEach((item) => {
        setItems((prevItems) => {
          if (prevItems.find((pItem) => pItem.id === item.id)) return prevItems;
          return [...prevItems, { id: item.id, ...item.data() }];
        });
      });
    });
    setLoading(false);
  }, []);

  function getCategoryItem(category) {
    return items
      .map((item, inde) => {
        if (dashify(item.category) === category) return item;
      })
      .filter((item) => item !== undefined);
  }

  const value = {
    loadingItems: loading,
    getCategoryItem,
  };

  return <FAQContext.Provider value={value}>{children}</FAQContext.Provider>;
}
