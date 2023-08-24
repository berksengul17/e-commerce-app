import React, { useContext } from "react";
import { CartContext } from "../../context/CartProvider";
import styles from "./quantityPicker.module.css";

function QuantityPicker({ id, quantity }) {
  const { addCartItem, removeCartItem } = useContext(CartContext);

  const decrement = () => {
    removeCartItem(id);
  };
  const increment = () => {
    addCartItem(id);
  };

  return (
    <div className={styles.quantityPicker}>
      {quantity > 0 && <button onClick={decrement}>&minus;</button>}
      <input type="text" value={quantity} readOnly />
      <button onClick={increment}>+</button>
    </div>
  );
}

export default QuantityPicker;
