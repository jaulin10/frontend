import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import App from "./App";
import axios from "axios";

// Configuration d'Axios
axios.defaults.baseURL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";
axios.defaults.headers.common["Content-Type"] = "application/json";

// Intercepteur pour les erreurs
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("Erreur de réponse:", error.response.data);
    } else if (error.request) {
      console.error("Impossible de contacter le serveur");
    } else {
      console.error("Erreur:", error.message);
    }
    return Promise.reject(error);
  }
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
