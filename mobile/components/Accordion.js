import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

function Accordion({ data }) {
  const [selectedItems, setSelectedItems] = useState([]);

  const parsedData = JSON.parse(data);

  const getKey = (obj) => {
    return Object.keys(obj)[0];
  };

  const getValue = (obj) => {
    const key = getKey(obj);
    return obj[key];
  };

  const toggle = (index) => {
    if (selectedItems.includes(index)) {
      setSelectedItems((items) =>
        items.filter((item) => {
          return item !== index;
        })
      );
    } else {
      setSelectedItems([index, ...selectedItems]);
    }
  };

  return (
    <>
      {parsedData.map((item, index) => (
        <View key={index} style={styles.accordionItem}>
          <View style={styles.title}>
            <TouchableOpacity
              style={styles.contentToggler}
              onPress={() => toggle(index)}
            >
              <Text style={styles.accordionItemHeader}>{getKey(item)}</Text>
              <Text style={styles.accordionItemHeader}>+</Text>
            </TouchableOpacity>
          </View>
          <View
            style={
              selectedItems.includes(index)
                ? [styles.content, styles.show]
                : styles.content
            }
          >
            <Text>{getValue(item)}</Text>
          </View>
        </View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  accordionItem: {
    marginBottom: 5,
    paddingTop: 10,
  },
  contentToggler: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  accordionItemHeader: {
    fontSize: 18,
    fontWeight: "bold",
  },
  content: {
    overflow: "hidden",
    maxHeight: 0,
    opacity: 0,
    paddingLeft: 20,
  },
  show: {
    maxHeight: 10000,
    opacity: 1,
  },
});

export default Accordion;
