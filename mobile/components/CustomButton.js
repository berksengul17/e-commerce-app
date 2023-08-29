import { Text, StyleSheet } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";

function CustomButton({ title, onPress, style, textStyle, disabled }) {
  return (
    <>
      <TouchableOpacity
        style={[styles.customButton, style, disabled ? styles.disabledBtn : ""]}
        onPress={onPress}
        disabled={disabled ? disabled : false}
      >
        <Text style={[textStyle, disabled ? styles.disabledText : ""]}>
          {title}
        </Text>
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
  disabledBtn: {
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: "gray",
  },
  disabledText: {
    color: "gray",
  },
});

export default CustomButton;
