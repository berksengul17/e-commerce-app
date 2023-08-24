import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import React from "react";
import { Link } from "expo-router";
import AddToCartButton from "./AddToCartButton";

const screenWidth = Dimensions.get("window").width;
const cardWidth = (screenWidth - 20) / 2;

function Product({ product }) {
  return (
    <View style={styles.productContainer}>
      <Link href={`/products/${product.id}`}>
        <View style={styles.productCard}>
          <Image source={{ uri: product.image }} style={styles.productImage} />
          <View style={styles.productInfo}>
            <Text>{product.name}</Text>
            <Text>${product.price}</Text>
          </View>
        </View>
      </Link>
      <AddToCartButton productId={product.id} />
    </View>
  );
}

const styles = StyleSheet.create({
  productContainer: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#e6e6e6",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    margin: 5,
    borderRadius: 5,
  },
  productCard: {
    width: cardWidth,
  },
  productImage: {
    height: 150,
    resizeMode: "contain",
    borderRadius: 5,
  },
  productInfo: {
    padding: 10,
    border: "1px solid red",
  },
});

export default Product;
