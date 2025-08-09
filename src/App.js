import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { testConnection } from "./services/api";
import "./App.css";

// Import des composants de pages
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import BasketPage from "./pages/BasketPage";
import AdminPage from "./pages/AdminPage";
import ReportsPage from "./pages/ReportsPage";

// Import des composants communs
import Header from "./components/common/Header";
import Navigation from "./components/common/Navigation";
import Footer from "./components/common/Footer";

// Import du nouveau composant de test de connexion
import ConnectionTest from "./components/common/ConnectionTest";

function App() {
  const [backendConnected, setBackendConnected] = useState(false);
  const [connectionChecked, setConnectionChecked] = useState(false);
  const [checkingConnection, setCheckingConnection] = useState(true);

  // Vérifier la connexion backend au démarrage
  useEffect(() => {
    checkBackendConnection();

    // Vérifier la connexion périodiquement (toutes les 30 secondes)
    const interval = setInterval(checkBackendConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkBackendConnection = async () => {
    try {
      const result = await testConnection();
      setBackendConnected(result.success);

      if (result.success) {
        console.log("✅ Backend connecté avec succès !");
      } else {
        console.warn(
          "⚠️ Impossible de se connecter au backend:",
          result.message
        );
      }
    } catch (error) {
      console.error("❌ Erreur de connexion backend:", error);
      setBackendConnected(false);
    } finally {
      setConnectionChecked(true);
      setCheckingConnection(false);
    }
  };

  // Composant d'indicateur de connexion
  const ConnectionIndicator = () => (
    <div
      className={`connection-indicator ${
        backendConnected ? "connected" : "disconnected"
      }`}
    >
      <div className="connection-content">
        <span className="status-icon">
          {checkingConnection ? "🔄" : backendConnected ? "🟢" : "🔴"}
        </span>
        <span className="status-text">
          {checkingConnection
            ? "Vérification..."
            : `Backend ${backendConnected ? "Connecté" : "Déconnecté"}`}
        </span>
        <span className="backend-url">
          {process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api"}
        </span>
        <button
          onClick={checkBackendConnection}
          className="refresh-btn"
          title="Rafraîchir la connexion"
          disabled={checkingConnection}
        >
          {checkingConnection ? "⏳" : "🔄"}
        </button>
      </div>
    </div>
  );

  // Composant d'alerte si backend déconnecté
  const BackendWarning = () => {
    if (backendConnected || !connectionChecked) return null;

    return (
      <div className="backend-warning">
        <div className="warning-content">
          <span className="warning-icon">⚠️</span>
          <span className="warning-text">
            Backend déconnecté. Certaines fonctionnalités peuvent ne pas
            fonctionner correctement.
          </span>
          <a href="/connection-test" className="test-connection-btn">
            Diagnostiquer
          </a>
        </div>
      </div>
    );
  };

  // Écran de chargement initial
  if (!connectionChecked) {
    return (
      <div className="app-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <h3>Initialisation de l'application</h3>
          <p>Vérification de la connexion backend...</p>
          <small>
            {process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api"}
          </small>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Header />

        {/* Indicateur de connexion */}
        <ConnectionIndicator />

        {/* Alerte si backend déconnecté */}
        <BackendWarning />

        <div className="app-container">
          <Navigation backendConnected={backendConnected} />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/basket" element={<BasketPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/connection-test" element={<ConnectionTest />} />
            </Routes>
          </main>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
