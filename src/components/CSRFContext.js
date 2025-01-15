import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchCSRFToken } from "../services/api";

const CSRFContext = createContext();

export const CSRFProvider = ({ children }) => {
  const [csrfToken, setCsrfToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCSRFToken = async () => {
      try {
        const token = await fetchCSRFToken();
        setCsrfToken(token);
      } catch (error) {
        console.error("Error loading CSRF token:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCSRFToken();
  }, []);

  return (
    <CSRFContext.Provider value={{ csrfToken, loading }}>
      {children}
    </CSRFContext.Provider>
  );
};

export const useCSRF = () => {
  return useContext(CSRFContext);
};
