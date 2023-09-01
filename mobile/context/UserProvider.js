import { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");

  // bir kullanıcı ile giriş yap sonra çıkış yap başka bir kullanıcıyla giriş yap
  // uygulamayı kapa aç hangi kullanıcı açık kalmış bak
  // eğer dependency array e user eklenmesi gerekirse token kaydetme işini buraya al
  useEffect(() => {
    const fetchStoredUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };
    fetchStoredUser();
  }, []);

  const loginUser = async (user) => {
    setUser(user);
    await AsyncStorage.setItem("user", JSON.stringify(user));
  };

  const logoutUser = async () => {
    setUser(null);
    await AsyncStorage.removeItem("user");
  };

  return (
    <UserContext.Provider
      value={{ user, loginUser, logoutUser, token, setToken }}
    >
      {children}
    </UserContext.Provider>
  );
};
