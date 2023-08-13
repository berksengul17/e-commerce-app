import React from "react";
import { Link } from "react-router-dom";
import AddToCartButton from "../AddToCartButton";
import styles from "./product.module.css";

function Product({ product }) {
  return (
    <li className={styles.product}>
      <Link to={`/products/${product.id}`}>
        <img src={product.image} alt="product" />
        <div className={styles.productInfo}>
          <p>{product.name}</p>
          <p>${product.price}</p>
        </div>
      </Link>
      <AddToCartButton productId={product.id} />
    </li>
  );
}

export default Product;
