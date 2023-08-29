import { FlatList, StyleSheet, TextInput, View } from "react-native";
import { useState, useEffect } from "react";
import { getAllProducts } from "../../api/productService";
import Product from "../../components/Product";
import { FontAwesome } from "@expo/vector-icons";

function Home() {
  const [search, setSearch] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    getAllProducts()
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const searchProducts = (text) => {
    if (text) {
      const filteredData = products.filter((product) => {
        const productData = product.name
          ? product.name.toUpperCase()
          : "".toUpperCase();
        const textData = text.toUpperCase();
        return productData.indexOf(textData) > -1;
      });
      setFilteredProducts(filteredData);
      setSearch(text);
    } else {
      setFilteredProducts(products);
      setSearch(text);
    }
  };

  return (
    <View style={styles.productList}>
      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={16} style={{ marginRight: 5 }} />
        <TextInput
          onChangeText={(text) => searchProducts(text)}
          value={search}
          placeholder="Search..."
        />
      </View>
      <FlatList
        numColumns={2}
        data={filteredProducts}
        renderItem={({ item }) => <Product product={item} />}
        keyExtractor={(product) => product.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  productList: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "60%",
    backgroundColor: "white",
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 5,
    marginVertical: 10,
  },
});

export default Home;
