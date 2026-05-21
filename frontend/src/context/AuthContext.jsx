import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

function decodeToken(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return { username: payload.sub, role: payload.role };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("hms_token");
    return token ? decodeToken(token) : null;
  });

  const login = (token) => {
    localStorage.setItem("hms_token", token);
    setUser(decodeToken(token));
  };

  const logout = () => {
    localStorage.removeItem("hms_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
