import React, { useContext } from "react";
import { CartContext } from "../../context/CartProvider";
import CartItem from "../../components/CartItem";

function Cart() {
  const { cartItems, totalCartPrice } = useContext(CartContext);

  return (
    <div>
      <p>Cart</p>
      {Object.entries(cartItems).map(([productId, quantity]) => (
        <CartItem key={productId} id={productId} quantity={quantity} />
      ))}
      <p>Total price: ${(Math.round(totalCartPrice * 100) / 100).toFixed(2)}</p>
    </div>
  );
}

export default Cart;
