import { View, Text, StyleSheet } from "react-native";
import React, { useContext } from "react";
import { UserContext } from "../../context/UserProvider";
import CustomButton from "../../components/CustomButton";
import { Link } from "expo-router";

function Profile() {
  const { user, logoutUser } = useContext(UserContext);

  return (
    <View style={styles.profileContainer}>
      {!user ? (
        <>
          <Text>Please log in to see user details</Text>
          <Link href="/login">
            <CustomButton title="Login" />
          </Link>
        </>
      ) : (
        <>
          <Text>You are logged in {user.email}</Text>
          <CustomButton title="Logout" onPress={logoutUser} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  profileContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Profile;
