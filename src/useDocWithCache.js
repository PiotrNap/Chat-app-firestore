import { useState, useEffect } from 'react';
import { db } from './firebase';

const cache = {};
const pendingCache = {};

export default function useDocWithCache(path) {
  const [doc, setDoc] = useState(cache[path]);

  useEffect(() => {
    if (doc) return;

    let isMounting = true;

    const pending = pendingCache[path];

    if (!path) return;
    else {
      const promise = pending || (pendingCache[path] = db.doc(path).get());

      promise.then((doc) => {
        if (isMounting) {
          const user = {
            ...doc.data(),
            id: doc.id,
          };
          setDoc(user);
          cache[path] = user;
        }
      });
    }

    return () => (isMounting = false);
  }, [doc, path]);

  return doc;
}
