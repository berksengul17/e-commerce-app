import React, { useContext, useEffect, useState } from "react";
import { getProductById } from "../../api/productService";
import QuantityPicker from "../QuantityPicker";
import styles from "./cartItem.module.css";
import { CartContext } from "../../context/CartProvider";

function CartItem({ id, quantity }) {
  const [product, setProduct] = useState(null);
  const { setTotalCartPrice } = useContext(CartContext);

  useEffect(() => {
    getProductById(id)
      .then((data) => {
        setProduct(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      {product && (
        <div className={styles.cartItemContainer}>
          <div>
            <img src={product.image} alt="product" />
            <p>{product.name}</p>
          </div>
          <div>
            <p>
              Price: $
              {(Math.round(quantity * product.price * 100) / 100).toFixed(2)}
            </p>
            <QuantityPicker id={product.id} />
          </div>
        </div>
      )}
    </>
  );
}

export default CartItem;
