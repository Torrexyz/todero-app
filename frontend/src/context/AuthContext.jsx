import { createContext, useState, useContext } from "react";

//====================//

const AuthContext = createContext(null);

//====================//

export function AuthProvider({ children }) {
  //..........//

  const [sessdata, setSess] = useState({ userId: "usr_uymy3n7u676n" });
  const [loading, setLoading] = useState(false);

  //..........//

  const login = () => {
    setLoading(true);
  };

  const logout = () => {
    setSess(null);
  };

  //..........//

  const value = {
    sessdata,
    loading,
    login,
    logout,
    isAuthenticated: !!sessdata,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;

  //..........//
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};
