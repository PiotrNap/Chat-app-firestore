import { useState, useEffect } from 'react';
import { db } from './firebase';

export default function (path) {
  const [newDoc, setDoc] = useState(null);

  useEffect(() => {
    return async function fetchDoc() {
      await db.doc(path).onSnapshot((doc) => {
        setDoc({
          ...doc.data(),
          id: doc.id,
        });
      });
      fetchDoc();
    };
  }, [path]);

  return newDoc;
}
