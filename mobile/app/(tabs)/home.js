import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { getAllProducts } from "../../api/productService";
import Product from "../../components/Product";

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    getAllProducts()
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.productList}>
        <FlatList
          numColumns={2}
          data={products}
          renderItem={({ item }) => <Product product={item} />}
          keyExtractor={(product) => product.id.toString()}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  productList: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Home;
