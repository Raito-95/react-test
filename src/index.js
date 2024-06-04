import React, { createContext, useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { fetchCSRFToken } from "./services/api";

export const CSRFContext = createContext();

const CSRFProvider = ({ children }) => {
  const [csrfToken, setCSRFToken] = useState("");

  useEffect(() => {
    const getToken = async () => {
      try {
        const token = await fetchCSRFToken();
        setCSRFToken(token);
      } catch (error) {
        console.error("Error fetching CSRF token:", error);
      }
    };

    getToken();
  }, []);

  return (
    <CSRFContext.Provider value={csrfToken}>{children}</CSRFContext.Provider>
  );
};

// Fetch CSRF token when the app loads
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  //<React.StrictMode>
  <CSRFProvider>
    <App />
  </CSRFProvider>
  //</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
