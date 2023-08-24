import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../../api/productService";
import Accordion from "../../components/Accordion";
import AddToCartButton from "../../components/AddToCartButton";
import styles from "./productDetails.module.css";

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
            <img src={product.image} alt="product" />
          </div>
          <div className={styles.productInfo}>
            <h1>{product.name}</h1>
            <div>
              <h2>${product.price}</h2>
              <AddToCartButton
                additionalClasses={styles.addToCartBtn}
                productId={product.id}
              />
              <Accordion data={product.description} data-testid="accordion" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetails;
