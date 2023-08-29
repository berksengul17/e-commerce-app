import { View, Text, Image, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { getProductById } from "../../api/productService";
import AddToCartButton from "../../components/AddToCartButton";
import Accordion from "../../components/Accordion";
import { ScrollView } from "react-native";

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
    <ScrollView>
      <View style={styles.container}>
        <Stack.Screen options={{ headerTitle: ``, statusBarHidden: true }} />
        {product && (
          <View styles={styles.productContainer}>
            <View>
              <Image
                source={{ uri: product.image }}
                style={{ width: "100%", height: 500, resizeMode: "contain" }}
              />
            </View>
            <View>
              <Text style={styles.productInfo}>{product.name}</Text>
              <View>
                <Text style={styles.productInfo}>${product.price}</Text>
                <AddToCartButton
                  style={styles.addToCartBtn}
                  textStyle={{ fontSize: 18, fontWeight: "bold" }}
                  productId={product.id}
                />
                <Accordion data={product.description} />
              </View>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  productContainer: {
    padding: 20,
    margin: 20,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "black",
  },
  productInfo: {
    fontSize: 24,
    fontWeight: "bold",
  },
  addToCartBtn: {
    width: "100%",
    padding: 10,
    marginVertical: 20,
    marginHorizontal: 0,
  },
});

export default ProductDetails;
