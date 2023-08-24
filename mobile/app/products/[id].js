import { View, Text, Image, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { getProductById } from "../../api/productService";
import AddToCartButton from "../../components/AddToCartButton";
import Accordion from "../../components/Accordion";

function ProductDetails() {
  const [product, setProduct] = useState();
  const { id } = useLocalSearchParams();

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
    <View>
      <Stack.Screen options={{ headerTitle: `Details #${id}` }} />
      {product && (
        <View>
          <View>
            <Image
              source={{ uri: product.image }}
              style={{ width: "100%", height: 500 }}
            />
          </View>
          <View>
            <Text>{product.name}</Text>
            <View>
              <Text>${product.price}</Text>
              <AddToCartButton
                style={styles.addToCartBtn}
                productId={product.id}
              />
              <Accordion data={product.description} />
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  addToCartBtn: {
    width: "100%",
    padding: 10,
    fontSize: 18,
    marginVertical: 20,
    marginHorizontal: 0,
  },
});

export default ProductDetails;
