import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../../api/productService";
import Accordion from "../../components/Accordion";
import styles from "./productDetails.module.css";
import Button from "../../components/Button";

function ProductDetails() {
  const [product, setProduct] = useState();
  const { id } = useParams();
  const navigate = useNavigate();

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
      <Button onClick={() => navigate(-1)} text="Go back" />
      {product && (
        <div className={styles.productContainer}>
          <div className="image-container">
            <img src={product.image} alt="product image" />
          </div>
          <div>
            <h1>{product.name}</h1>
            <div className="product-info">
              <h2>${product.price}</h2>
              <Accordion data={product.description} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetails;
