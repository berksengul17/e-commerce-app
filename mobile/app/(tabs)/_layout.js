import { View, Text } from "react-native";
import React, { useContext } from "react";
import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { UserContext } from "../../context/UserProvider";

const TabLayout = () => {
  const { user } = useContext(UserContext);

  const screens = [];

  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          tabBarLabel: "Home",
          tabBarLabelStyle: {
            fontSize: 12,
            color: "black",
            fontWeight: "bold",
          },
          tabBarIcon: () => <FontAwesome name="home" size={24} />,
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          href: user ? "/cart" : null,
          headerShown: false,
          tabBarLabel: "Cart",
          tabBarLabelStyle: {
            fontSize: 12,
            color: "black",
            fontWeight: "bold",
          },
          tabBarIcon: () => <FontAwesome name="shopping-cart" size={24} />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarLabel: "Profile",
          tabBarLabelStyle: {
            fontSize: 12,
            color: "black",
            fontWeight: "bold",
          },
          tabBarIcon: () => <FontAwesome name="user" size={24} />,
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
