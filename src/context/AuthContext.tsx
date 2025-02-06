import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthenticationApiService from "../services/AuthenticationApiService";
import { showSuccessToast } from "../components/Toast";

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const authService = new AuthenticationApiService(navigate);

  useEffect(() => {
    const session = localStorage.getItem("session");
    const expiryToken = localStorage.getItem("x-expiry-token");
    if (expiryToken && session) {
      if (checkIfBeforeExpiry(expiryToken)) {
        setIsAuthenticated(true);
        setUser(JSON.parse(session));
      } else {
        setIsAuthenticated(false);
        setUser({});
        localStorage.removeItem("session");
        localStorage.removeItem("x-expiry-token");
      }
    } else {
      setIsAuthenticated(false);
      setUser({});
      localStorage.removeItem("session");
      localStorage.removeItem("x-expiry-token");
    }
  }, []);

  const checkIfBeforeExpiry = (expiryTime: string) => {
    const expiryDate = new Date(expiryTime);
    const currentDate = new Date();
    return currentDate < expiryDate;
  };

  const login = async (username: string, password: string) => {
    const user = { username, role: "admin", token: "" };
    authService.login(username, password).then((response) => {
      if (response?.statusCode === 200) {
        user.token = response?.data?.token || "";
        showSuccessToast(response.message);
        localStorage.setItem("session", JSON.stringify(user));
        localStorage.setItem(
          "x-expiry-token",
          response?.data?.["x-expiry-token"]
        );
        setUser(user);
        setIsAuthenticated(true);
        navigate("/");
      } else {
        navigate("/login");
      }
    });
  };

  const logout = () => {
    localStorage.removeItem("session");
    localStorage.removeItem("x-expiry-token");
    setUser({});
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
