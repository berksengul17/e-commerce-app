import React, { useContext, useState } from "react";
import { CartContext } from "../../context/CartProvider";

function QuantityPicker({ id }) {
  const { cartItems, addCartItem, removeCartItem } = useContext(CartContext);

  const decrement = () => {
    removeCartItem(id);
  };
  const increment = () => {
    addCartItem(id);
  };

  return (
    <div>
      {cartItems[id] > 1 && <button onClick={decrement}>-</button>}
      <input type="text" value={cartItems[id]} readOnly />
      <button onClick={increment}>+</button>
    </div>
  );
}

export default QuantityPicker;
