import { createContext, useState } from "react";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  // const [user, setUser] = useState(() => {
  //   const storedUser = localStorage.getItem("user");
  //   return storedUser ? JSON.parse(storedUser) : null;
  // });
  const [user, setUser] = useState(null);

  const loginUser = (user) => {
    // localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };

  const logoutUser = () => {
    // localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};
