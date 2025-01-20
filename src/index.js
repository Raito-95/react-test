import React, { createContext, useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { fetchCSRFToken } from "./services/Api";

export const CSRFContext = createContext();

const CSRFProvider = ({ children }) => {
  const [csrfToken, setCSRFToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCSRFToken = async () => {
      if (!csrfToken) {
        try {
          const token = await fetchCSRFToken();
          setCSRFToken(token);
        } catch (error) {
          console.error("Error fetching CSRF token:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    loadCSRFToken();
  }, [csrfToken]);

  return (
    <CSRFContext.Provider value={{ csrfToken, loading }}>
      {children}
    </CSRFContext.Provider>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <CSRFProvider>
    <App />
  </CSRFProvider>
);

reportWebVitals();
