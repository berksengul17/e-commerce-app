import { View, Text, Button, StyleSheet } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";

function CustomButton({ title, onPress, style }) {
  return (
    <>
      <TouchableOpacity style={[styles.customButton, style]} onPress={onPress}>
        <Text>{title}</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  customButton: {
    backgroundColor: "transparent",
    paddingLeft: 6,
    paddingRight: 6,
    paddingTop: 3,
    paddingBottom: 3,
    borderRadius: 10,
    margin: "auto",
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: "rgb(19,19,19)",
    color: "rgb(19,19,19)",
    alignItems: "center",
  },
});

export default CustomButton;
