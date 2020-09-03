import { useState, useEffect } from 'react';
import { db } from './firebase';

export default function (path, orderBy, where = []) {
  const [value, setValue] = useState([]);

  const [queryField, queryOperator, queryValue] = where;

  useEffect(() => {
    let collection = db.collection(path);

    if (orderBy) collection = collection.orderBy(orderBy);
    if (queryField)
      collection = collection.where(queryField, queryOperator, queryValue);

    return collection.onSnapshot((snapshot) => {
      const value = [];
      snapshot.forEach((item) => {
        value.push({
          ...item.data(),
          id: item.id,
        });
      });
      setValue(value);
    });
  }, [path, orderBy, queryField, queryOperator, queryValue]);

  return value;
}
