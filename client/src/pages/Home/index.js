import React from "react";
import ProductList from "../../components/ProductList";
import styles from "./home.module.css";

function Home() {
  return (
    <div className={styles.home}>
      <ProductList />
    </div>
  );
}

export default Home;
