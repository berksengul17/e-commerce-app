import React, { useContext } from "react";
import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { UserContext } from "../../context/UserProvider";

const TabLayout = () => {
  const { user } = useContext(UserContext);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "black",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          tabBarLabel: "Home",
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "bold",
          },
          tabBarIcon: ({ focused }) => (
            <FontAwesome
              name="home"
              color={focused ? "#007AFF" : "black"}
              size={24}
            />
          ),
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
            fontWeight: "bold",
          },
          tabBarIcon: ({ focused }) => (
            <FontAwesome
              name="shopping-cart"
              color={focused ? "#007AFF" : "black"}
              size={24}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarLabel: "Profile",
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "bold",
          },
          tabBarIcon: ({ focused }) => (
            <FontAwesome
              name="user"
              color={focused ? "#007AFF" : "black"}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
