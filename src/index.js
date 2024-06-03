import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const BASE_API_URL = process.env.REACT_APP_API_BASE_URL;

// Function to fetch CSRF token and ensure it's set in the browser's cookies
const fetchCSRFToken = async () => {
  // Assume you have an endpoint to get the CSRF token
  await fetch(`${BASE_API_URL}get_csrf_token/`, {
    credentials: "include", // Important to include credentials to receive the cookie
  });
};

// Fetch CSRF token when the app loads
fetchCSRFToken().then(() => {
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(
    //<React.StrictMode>
    <App />
    //</React.StrictMode>
  );

  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  reportWebVitals();
});
