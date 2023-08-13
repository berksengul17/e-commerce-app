import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../../api/productService";
import Accordion from "../../components/Accordion";
import styles from "./productDetails.module.css";
import Button from "../../components/Button";
import AddToCartButton from "../../components/AddToCartButton";

function ProductDetails() {
  const [product, setProduct] = useState();
  const { id } = useParams();

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = () => {
    getProductById(id)
      .then((data) => {
        setProduct(data);
      })
      .catch((error) => {
        console.log("Error getting product by id:" + error);
      });
  };

  return (
    <div>
      {product && (
        <div className={styles.productContainer}>
          <div className="image-container">
            <img src={product.image} alt="product image" />
          </div>
          <div className={styles.productInfo}>
            <h1>{product.name}</h1>
            <div>
              <h2>${product.price}</h2>
              <AddToCartButton
                additionalClasses={styles.addToCartBtn}
                productId={product.id}
              />
              <Accordion data={product.description} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetails;
