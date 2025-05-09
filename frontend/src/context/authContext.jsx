import { useState } from "react";
import { useContext } from "react";
import { createContext } from "react";

const AuthContext = createContext();

export const useAuthContext = () => {
  return useContext(AuthContext);
}

export const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(JSON.parse(localStorage.getItem("student-record-user")) || null);

  return <AuthContext.Provider value={{authUser, setAuthUser}}>{children}</AuthContext.Provider>
}
