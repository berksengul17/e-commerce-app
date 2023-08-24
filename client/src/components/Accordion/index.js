import React, { useState } from "react";
import styles from "./accordion.module.css";

function Accordion({ data }) {
  const [selectedItems, setSelectedItems] = useState([]);

  const parsedData = JSON.parse(data);

  const getKey = (obj) => {
    return Object.keys(obj)[0];
  };

  const getValue = (obj) => {
    const key = getKey(obj);
    return obj[key];
  };

  const toggle = (index) => {
    if (selectedItems.includes(index)) {
      setSelectedItems((items) =>
        items.filter((item) => {
          return item !== index;
        })
      );
    } else {
      setSelectedItems([index, ...selectedItems]);
    }
  };

  return (
    <>
      {parsedData.map((item, index) => (
        <div key={index} className={styles.accordionItem}>
          <div className={styles.title} onClick={() => toggle(index)}>
            <h2>{getKey(item)}</h2>
            <span>+</span>
          </div>
          <div
            className={
              selectedItems.includes(index)
                ? `${styles.content} ${styles.show}`
                : styles.content
            }
          >
            <p>{getValue(item)}</p>
          </div>
        </div>
      ))}
    </>
  );
}

export default Accordion;
