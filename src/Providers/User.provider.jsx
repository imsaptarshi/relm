import { createContext, useContext, useState } from "react";

const UserContext = createContext({
  user: undefined,
  setUser: () => {},
});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(undefined);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const User = () => useContext(UserContext);
